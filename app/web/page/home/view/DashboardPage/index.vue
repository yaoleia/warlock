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
                }
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
        mounted() {
            this.$request.record.getRecordList().then(resp => {
                if (resp.data.list) {
                    if (this.productList.length === 0 && resp.data.list[0]) {
                        this.curProduct = { ...resp.data.list[0] }
                    }
                    resp.data.list.forEach(l => {
                        const prod = this.productList.find(ll => ll.ts === l.ts)
                        if (!prod) {
                            this.productList.push(l)
                        }
                    })
                }
            })
        },
        methods: {
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
                    width: leftWrap.clientWidth / 1380,
                    height: leftWrap.clientHeight / 1082
                }
            },
            close() {
                this.switchCraft = true;
                this.curProduct = { ...this.productList[0] }
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
                window.ws.off('msg').emit('chat', this.$root.taskId).on('msg', m => {
                    if (this.switchCraft) {
                        this.curProduct = { ...m }
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
                this.curProduct = { ...p }
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
                this.getWsMsg()
            })
        },
        watch: {
            switchCraft(s) {
                if (s && this.$refs.component) {
                    this.$refs.component.forEach(element => {
                        element.close && element.close();
                    });
                    this.curProduct = { ...this.productList[0] }
                }
            },
            curProduct(p) {
                if (!p.ts) return;
                this.$refs.component.forEach(element => {
                    element.close && element.close();
                });
                $('.flicker', this.$el).finish().fadeOut('fast').fadeIn('fast');
                this.productList.forEach(l => {
                    l.act = l.ts === p.ts;
                })
                if (this.switchCraft && this.canScroll) {
                    $('.list-wrap', this.$el)[0].scrollTop = 0;
                }
                this.drawArea(p.phone_box)
            },
            productList(list) {
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
            <div :class='element.name' v-for="element in $root.workflow.layout" :key="element.id" :style="{top:element.top*sizeRate.height+'px',left:element.left*sizeRate.width+'px',width:element.width*sizeRate.width+'px',height:element.height*sizeRate.height+'px'}">
                <ul>
                    <li class="component-body" @mousedown='switchCraft=false'>
                        <component @close='close' ref='component' :is='element.name' v-bind="getProps(element.props,element.editProps)" :width='element.width' :height='element.height'></component>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-img-col col" @mousemove.prevent="canScroll=false" @mouseleave.prevent="canScroll=true">
            <p class="title">
                <span>实时记录</span>
                <span class='switch-name'>实时详情:</span>
                <el-tooltip v-if="switchCraft!==null" :content="switchCraft?'on':'off'" placement="top">
                    <el-switch v-model="switchCraft"></el-switch>
                </el-tooltip>
            </p>
            <div class="list-wrap">
                <transition-group name="list-complete" tag="p">
                    <ul class="list-complete-item" :class="item.act?'act':''" v-for='item in productList' :key="item.ts" @click="listItemClick(item)">
                        <msg-item v-for='(value,key) in item' :key='key' :_key='key' :value='value'></msg-item>
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
        .left-wrap {
            flex: 1;
            position: relative;
            > div {
                position: absolute;
            }
            ul {
                list-style: none;
            }
            .webcam {
                > ul {
                    width: 100%;
                    height: 100%;
                    .component-body {
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                    }
                }
            }
        }
        .col {
            p.title {
                font-size: 24px;
                line-height: 66px;
                position: absolute;
                left: 60px;
                top: 0;
                color: #9c9c9c;
                .ts {
                    font-size: 14px;
                    padding-left: 20px;
                }
            }
            .switch-name {
                margin-left: 25px;
                font-size: 14px;
            }
            &.right-img-col {
                width: 520px;
                position: relative;
                background: rgba(255, 255, 255, 0.06);
                border-radius: 18px;
                height: 1082px;
                padding: 66px 20px 60px 40px;
                display: block;
                overflow: hidden;
                .list-wrap {
                    overflow: auto;
                    width: 100%;
                    height: 100%;
                    padding-right: 30px;
                    .list-complete-item {
                        list-style: none;
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        color: #9c9c9c;
                        padding: 10px 20px;
                        justify-content: space-between;
                        cursor: pointer;
                        border-radius: 5px;
                        border-bottom: 1px solid #444;
                        line-height: 30px;
                        position: relative;
                        &.act {
                            background: #222;
                        }
                        &:last-child {
                            border: none;
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