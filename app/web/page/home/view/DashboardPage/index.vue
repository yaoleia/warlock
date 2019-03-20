<script type="text/babel">
    import imgStream from 'component/imgStream'
    import imgMagnifier from 'component/imgMagnifier'
    import utils from 'framework/utils'
    import msgItem from 'component/terminalBox/msgItem'
    import webcam from 'component/webcam'
    import * as d3 from 'd3';

    export default {
        data() {
            return {
                template_img: '/public/mock-img/template_img.jpg',
                productList: [],
                curProduct: {},
                curPosition: {},
                defaultConfig: { testUrl: '', title: '' },
                switchCraft: false,
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
        inject: ['socket'],
        computed: {
            serverUrl() {
                return this.$store.state.serverUrl
            }
        },
        async mounted() {
            // TODO: 获取历史记录
            // this.$request.record.getRecordList().then(resp => {
            //     if (resp.data.list) {
            //         if (this.productList.length === 0 && resp.data.list[0]) {
            //             this.curProduct = resp.data.list[0];
            //         }
            //         resp.data.list.forEach(l => {
            //             l.act = false;
            //             const prod = this.productList.find(ll => ll.ts === l.ts)
            //             if (!prod) {
            //                 this.productList.push(l)
            //             }
            //         })
            //     }
            // })

            try {
                const workflowid = this.$root.workflowid;
                if (!workflowid) return;
                const resp = await this.$request.workflow.getWorkflowById(workflowid);
                this.workflow = resp.data;
            } catch (error) {
                this.$message({
                    message: '获取workflow失败！',
                    type: 'error'
                })
            }

            this.$nextTick(() => {
                if (this.socket.connected) {
                    this.emitWsEvent()
                } else {
                    this.socket.once('connect', () => {
                        this.emitWsEvent()
                    })
                }
            })

            this.$once('hook:beforeDestroy', () => {
                this.socket.off('msg');
                this.socket.off('workflow');
            })
        },
        methods: {
            emitWsEvent() {
                this.socket.on('workflow', data => {
                    const { type, msg } = data;
                    if (type === 'update') {
                        if (this.workflow._id !== msg._id) return;
                        Object.assign(this.workflow, msg);
                    }
                    if (type === 'delete') {
                        if (this.workflow._id !== msg._id) return;
                        Object.assign(this.workflow, { task_id: '', active: false })
                    }
                })

                this.socket.on('msg', m => {
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
                });
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
                let resp = null;
                try {
                    if (statu) {
                        resp = await this.$request.task.postTask(this.workflow);
                    } else {
                        resp = await this.$request.task.deleteTask(this.workflow._id);
                    }
                } catch (error) {
                    if (statu) {
                        this.workflow.task_id = '';
                        this.workflow.active = false;
                    }
                } finally {
                    loading.close();
                }
            },
            resize() {
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
            emitChat() {
                if (this.workflow.task_id) {
                    this.cacheTaskId = this.workflow.task_id;
                    this.socket.emit('join', this.workflow.task_id)
                } else {
                    this.socket.emit('leave', this.cacheTaskId)
                    this.cacheTaskId = null;
                }
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
        },
        watch: {
            workflow: {
                handler(workflow) {
                    if (workflow.active) {
                        this.switchCraft = true;
                    }
                    this.emitChat();
                },
                deep: true
            },
            switchCraft(s) {
                if (s && this.$refs.component) {
                    this.$refs.component.forEach(element => {
                        element.close && element.close();
                    });
                    const product = this.productList[0];
                    if (product) {
                        this.curProduct = product;
                    }
                }
            },
            curProduct(p, oldp) {
                if (!p.ts) return;
                oldp.act = false;
                p.act = true;
                if (Array.isArray(this.$refs.component)) {
                    this.$refs.component.forEach(element => {
                        element.close && element.close();
                    });
                }
                // 闪现目标定位的红框
                // $('.flicker', this.$el).finish().fadeOut('fast').fadeIn('fast');
                // this.drawArea(p.phone_box)

                const parent = $('.list-wrap', this.$el)[0];
                if (this.switchCraft && this.canScroll) {
                    parent.scrollTop = 0;
                }

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
            imgMagnifier,
            msgItem,
            webcam
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
                        <component @close='close' ref='component' :is='element.name' v-bind="getProps(element.props,element.editProps)" :width='element.width*sizeRate.width' :height='element.height*sizeRate.height'></component>
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
                        <el-switch :value="workflow.active" @change="activeChange"></el-switch>
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
