<script type="text/babel">
    import imgStream from 'component/imgStream'
    import magnifier from 'component/magnifier'
    import utils from 'framework/utils'
    import msgItem from 'component/TerminalBox/msgItem'
    import * as d3 from 'd3';

    export default {
        data() {
            return {
                template_img: '/public/mock-img/template_img.jpg',
                productList: [],
                opts: {},
                curProduct: {},
                curPosition: {},
                defaultConfig: { testUrl: '', title: '' },
                switchCraft: null,
                canScroll: true,
                svg: {
                    width: 600,
                    height: 400
                },
                sizeRate: {
                    width: 1,
                    height: 1
                },
                workflow: {}
            }
        },
        computed: {
            serverUrl() {
                return this.$store.state.serverUrl
            }
        },
        beforeMount() {
            // 只会在浏览器执行
            this.$options.components.webcam = () => import('component/webcam')
        },
        async mounted() {
            this.$request.record.getRecordList().then(resp => {
                if (resp.data.list) {
                    if (this.productList.length === 0 && resp.data.list[0]) {
                        this.curProduct = resp.data.list[0];
                    }
                    resp.data.list.forEach(l => {
                        const prod = this.productList.find(ll => ll.ts === l.ts)
                        if (!prod) {
                            this.productList.push(l)
                        }
                    })
                }
            })

            this.$nextTick(() => {
                if (window.ws.connected) {
                    this.emitWorkflow()
                } else {
                    window.ws.on('connect', () => {
                        this.emitWorkflow()
                    })
                }
            })

            try {
                const workflowid = this.$root.workflowid;
                if (!workflowid) return;
                const resp = await this.$request.workflow.getWorkflowById(workflowid);
                this.workflow = resp.data;
                this.getWsMsg();
            } catch (error) {
                this.$message({
                    message: '获取workflow失败！',
                    type: 'error'
                })
            }
        },
        methods: {
            emitWorkflow() {
                window.ws.on('workflow', msg => {
                    if (this.workflow._id !== msg._id) return;
                    Object.assign(this.workflow, msg);
                    this.getWsMsg();
                })
            },
            loadingUi() {
                return this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            },
            async activeChange(statu) {
                // task开关
                const loading = this.loadingUi();
                try {
                    if (statu) {
                        await this.creatTask(this.workflow);
                    } else {
                        await this.deleteTask(this.workflow);
                    }
                    await this.$request.workflow.patchWorkflow(this.workflow._id, this.workflow);
                    this.getWsMsg();
                } catch (error) {
                    throw error;
                } finally {
                    loading.close();
                    window.ws.emit('workflow', this.workflow);
                }
            },
            async creatTask(item) {
                // 创建task
                try {
                    // 获取一个任务id
                    const task = await this.$request.task.getTaskId();
                    const taskId = task.data;
                    if (taskId) {
                        const creatTask = await this.$request.task.postTask({
                            task_id: taskId,
                            workflow_id: item._id
                        });
                        if (creatTask.data.indexOf('error') != -1) {
                            item.task_id = '';
                            item.active = false;
                            this.$message({
                                message: `开启任务失败! ${creatTask.data}`,
                                type: 'error'
                            })
                            return;
                        }
                        item.active = true;
                        item.task_id = taskId;
                    }
                } catch (error) {
                    item.active = false;
                }
            },
            async deleteTask(item) {
                // 删除task
                try {
                    const deleteTask = await this.$request.task.deleteTask(item.task_id);
                    item.active = false;
                    item.task_id = '';
                } catch (error) {
                    item.active = true;
                }
            },
            resize() {
                if (window.innerWidth <= 1920) {
                    this.opts = {
                        width: 450,
                        height: 300,
                        dest_width: 320,
                        dest_height: 240,
                        crop_width: 450,
                        crop_height: 338
                    }
                } else {
                    this.opts = {}
                }
                const leftWrap = this.$refs.leftWrap;
                this.sizeRate = {
                    width: leftWrap.clientWidth / 1340,
                    height: leftWrap.clientHeight / 1082
                }
            },
            close() {
                this.switchCraft = true;
                this.curProduct = this.productList[0]
            },
            ifOk(type) {
                return utils.ifOk(type)
            },
            defectType(type) {
                return utils.defectType(type)
            },
            getWsMsg() {
                if (window.ws.connected) {
                    this.emitChat()
                    this.switchCraft = true;
                } else {
                    window.ws.on('connect', () => {
                        this.switchCraft = true;
                        this.emitChat()
                    })
                }
            },
            emitChat() {
                window.ws.off('msg').emit('chat', this.workflow.task_id).on('msg', m => {
                    if (this.switchCraft) {
                        this.curProduct = m
                    }
                    m.act = false;
                    const product = this.productList.find(l => l.ts === m.ts);
                    if (!product) {
                        this.productList.unshift(m);
                    } else {
                        // 检测去重
                        Object.assign(product, this.curProduct)
                    }

                    const self = this;
                    if (!m.status) {
                        this.$notify({
                            title: `PID: ${m.ts}`,
                            customClass: 'warlock-warning-notify',
                            dangerouslyUseHTMLString: true,
                            message: `<div class="dm-img">
                                        <p>NG</p>
                                    </div>`,
                            type: 'warning',
                            position: 'bottom-right',
                            onClick() {
                                if (self.$route.path !== '/') {
                                    self.$router.push('/')
                                }
                                self.listItemClick(m);
                            }
                        });
                    }
                })
            },
            listItemClick(p) {
                this.switchCraft = false;
                this.curProduct = p;
            },
            drawArea(data) {
                const boardArea = d3.select('#board-area');
                boardArea.selectAll('*').remove();
                if (!data) return;

                // 排序画框4点
                // let [p0, ...ps] = Object.values(data), p0max = 0, p2, p13 = [];
                // ps.forEach(p => {
                //     let max = Math.abs(p0.x - p.x) + Math.abs(p0.y - p.y);
                //     if (max >= p0max) {
                //         p0max = max;
                //         p2 && p13.push(p2)
                //         p2 = p;
                //     } else {
                //         p13.push(p)
                //     }
                // })
                // data = [p0, p13[0], p2, p13[1], p0];

                const { point1, point2, point3, point4 } = data;
                data = [point1, point2, point3, point4, point1];

                const $msgBox = $('.msg.flicker', this.$el);
                const mWidth = $msgBox[0].clientWidth,
                    mHeight = $msgBox[0].clientHeight;
                this.svg.width = mWidth;
                this.svg.height = mHeight;

                let img = new Image()
                img.onload = e => {
                    boardArea.selectAll('*').remove();
                    const scaleX = img.naturalWidth / mWidth
                    const scaleY = img.naturalHeight / mHeight
                    const lineGenerator = d3.line().x(d => d.x / scaleX).y(d => d.y / scaleY);
                    boardArea.append('path').attr('stroke', '#f44336').attr('stroke-width', '2').attr('fill', 'none').attr('d', lineGenerator(data));

                    img = null;
                }
                img.onerror = e => {
                    img = null
                }
                img.src = this.curProduct.seg_img_path
            },
            getProps(props, editProps) {
                const p = {}
                if (!props) return p;
                for (const key in props) {
                    if (props.hasOwnProperty(key)) {
                        const element = props[key];
                        const bind = editProps && editProps[key].bind;
                        if (!editProps) {
                            p[key] = this.defaultConfig[key] || this.defaultConfig.testUrl;
                            continue;
                        }
                        if (editProps[key].switch) {
                            p[key] = bind
                            continue;
                        }
                        p[key] = this.curProduct[bind] || this.defaultConfig[key] || this.defaultConfig.testUrl;
                    }
                }
                return p;
            }
        },
        activated() {
            this.resize()
            window.onresize = () => {
                this.resize()
            }
            const video = document.querySelectorAll('video')[0]
            if (video) {
                video.play()
            }
            this.$nextTick(() => {
                if (this.workflow.task_id) {
                    this.getWsMsg()
                }
            })
        },
        watch: {
            switchCraft(s) {
                if (s && this.$refs.component) {
                    this.$refs.component.forEach(element => {
                        element.close && element.close();
                    });
                    this.curProduct = this.productList[0]
                }
            },
            curProduct(p, oldp) {
                if (!p.ts) return;
                oldp.act = false;
                p.act = true;
                this.$refs.component.forEach(element => {
                    element.close && element.close();
                });
                // 闪现目标定位的红框
                // $('.flicker', this.$el).finish().fadeOut('fast').fadeIn('fast');
                const parent = $('.list-wrap', this.$el)[0];
                if (this.switchCraft && this.canScroll) {
                    parent.scrollTop = 0;
                }
                this.drawArea(p.phone_box)

                this.$nextTick(() => {
                    this.curPosition.dom = this.$refs[`item_${p.ts}`][0];
                    this.curPosition.parent = parent;
                    this.curPosition.top = this.curPosition.dom.offsetTop - parent.scrollTop;
                })
            },
            productList(list) {
                this.$nextTick(() => {
                    if (this.curPosition.dom) {
                        const index = this.productList.indexOf(this.curProduct);
                        const clientHeight = this.curPosition.dom.clientHeight;
                        const y = index * clientHeight - this.curPosition.top;
                        this.curPosition.parent.scrollTop = y < 0 ? 0 : y;
                    }
                })
                while (list && list.length > 100) {
                    list.pop();
                }
            }
        },
        components: {
            imgStream,
            magnifier,
            msgItem
        }
    }
</script>
<template>
    <div class="dashboard">
        <div class='left-wrap col' ref='leftWrap'>
            <div class="title">
                <div class='switch-wrap'>
                    <span class='switch-name'>实时详情:</span>
                    <el-tooltip v-if="switchCraft!==null" :content="switchCraft?'on':'off'" placement="top">
                        <el-switch v-model="switchCraft"></el-switch>
                    </el-tooltip>
                </div>
            </div>
            <div :class='element.name' v-for="element in workflow.layout" :key="element.id" :style="{top:element.top*sizeRate.height+'px',left:element.left*sizeRate.width+'px',width:element.width*sizeRate.width+'px',height:element.height*sizeRate.height+'px'}">
                <ul>
                    <li class="component-body" @mousedown='switchCraft=false'>
                        <component @close='close' ref='component' :is='element.name' v-bind="getProps(element.props,element.editProps)" :width='element.width' :height='element.height'></component>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-img-col col" @mousemove.prevent="canScroll=false" @mouseleave.prevent="canScroll=true">
            <div class="title">
                <span>实时记录</span>
                <div class='switch-wrap'>
                    <span class='switch-name'>任务开关:</span>
                    <el-tooltip v-if="workflow.active!==undefined" :content="workflow.active?'on':'off'" placement="top">
                        <el-switch v-model="workflow.active" @change="activeChange"></el-switch>
                    </el-tooltip>
                </div>
            </div>
            <div class="list-wrap">
                <transition-group name="list" tag="p">
                    <ul class="list-item" :ref="'item_'+item.ts" :class="item.act?'act':''" v-for='item in productList' :key="item.ts" @click="listItemClick(item)">
                        <msg-item v-for='(value,key) in {status:item.status,ts:item.ts}' :key='key' :_key='key' :value='value'></msg-item>
                    </ul>
                </transition-group>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    .dashboard {
        display: flex;
        justify-content: space-between;
        .list-enter-active,
        .list-leave-active {
            transition: all 0.5s;
        }
        .list-enter,
        .list-leave-to {
            opacity: 0;
            transform: translateY(-30px);
        }
        .title {
            font-size: 20px;
            line-height: 66px;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding-left: 30px;
            z-index: 5;
            color: #9c9c9c;
            .ts {
                font-size: 14px;
                padding-left: 20px;
            }
            .switch-wrap {
                position: absolute;
                right: 20px;
                top: 0;
                .switch-name {
                    margin-left: 25px;
                    font-size: 14px;
                }
            }
        }
        .left-wrap {
            border-radius: 18px;
            margin-right: 40px;
            background: rgba(255, 255, 255, 0.06);
            flex: 1;
            position: relative;
            > div {
                position: absolute;
            }
            .img-stream {
                background: none;
            }
            ul {
                list-style: none;
                height: 100%;
            }
            .component-body {
                height: 100%;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.06);
            }
            .webcam {
                border-radius: 10px;
                overflow: hidden;
                > ul {
                    width: 100%;
                    height: 100%;
                    .component-body {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
        .col {
            &.right-img-col {
                width: 520px;
                position: relative;
                background: rgba(255, 255, 255, 0.06);
                border-radius: 18px;
                padding: 66px 20px 60px 40px;
                display: block;
                overflow: hidden;
                .list-wrap {
                    position: relative;
                    overflow: auto;
                    width: 100%;
                    height: 100%;
                    padding-right: 30px;
                    .list-item {
                        list-style: none;
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        color: #9c9c9c;
                        padding: 10px 20px;
                        justify-content: space-between;
                        cursor: pointer;
                        border-radius: 5px;
                        line-height: 30px;
                        position: relative;
                        &.act {
                            background: #222;
                        }
                        &:last-child {
                            border: none;
                        }
                        .msg-item {
                            flex: 1;
                        }
                    }
                    .status {
                        font-weight: bold;
                        &.ok {
                            color: green;
                        }
                        &.ng {
                            color: #f44336;
                        }
                    }
                }
            }
        }
    }
</style>