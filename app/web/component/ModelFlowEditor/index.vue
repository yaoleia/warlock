<template>
    <div class="editor">
        <toolbar ref='toolbar' @read='readData' @change-eage="changeEage" :style="{visibility: readMode?'hidden':''}" />
        <div class='go-back'>
            <div class="design-name">流程名称：</div>
            <el-input class='name-input' v-model="name" placeholder="未命名" :disabled="readMode"></el-input>
            <el-button v-if="readMode" type="text" icon="el-icon-back" @click="goBack(true)">返回</el-button>
            <div v-else class="btns">
                <el-button type="primary" size="mini" @click="saveData">保存</el-button>
                <el-button type="text" icon="el-icon-back" @click="goBack(false)">返回</el-button>
            </div>
        </div>
        <div class="bottom-container">
            <item-pannel ref="itempannel" v-show="!readMode" />
            <detail-pannel ref='detailpannel' :readMode='readMode' :selectedModel='selectedModel' @updateGraph='updateGraph' @toggleGrid='toggleGrid' />
            <navigator :cur-zoom="curZoom" :min-zoom="minZoom" :max-zoom="maxZoom" @change-zoom="changeZoom">
                <div ref="minimap" slot="minimap"></div>
            </navigator>
            <page ref="page" @keydown.native.ctrl.192='ctrl192' />
            <terminal-box :msgList.sync='msgList' :showTerminal.sync='showTerminal' :terminalIs='terminalIs'></terminal-box>
            <context-menu ref="contextmenu" v-show="!readMode" @terminalFor='terminalFor' />
        </div>
    </div>
</template>

<script>
    import TerminalBox from '../TerminalBox'
    import DetailPannel from './detailpannel'
    import Navigator from './navigator';
    import ItemPannel from './itempannel'
    import Toolbar from './toolbar';
    import ContextMenu from './context-menu';
    import Page from './page';
    import Editor from './editor.js';
    import uuidv1 from 'uuid/v1';

    export default {
        components: {
            Navigator,
            Toolbar,
            ContextMenu,
            Page,
            ItemPannel,
            DetailPannel,
            TerminalBox
        },
        extends: Editor,
        data() {
            return {
                msgList: [],
                showTerminal: false,
                name: '',
                flowData: {},
                designItem: {
                    name: '',
                    id: '',
                    flowData: {},
                    cts: '',
                    ts: ''
                },
                terminalIs: ''
            };
        },
        props: ['editorLoaded'],
        computed: {
            readMode() {
                return this.$route.params.read;
            }
        },
        beforeDestroy() {
            this.editor.destroy();
        },
        async mounted() {
            await this.editorLoaded;
            const params = this.$route.params;
            this.init(params)
            if (params.flow) {
                this.designItem = params.flow;
                this.flowData = JSON.parse(JSON.stringify(params.flow.flowData));
                this.name = params.flow.name;
                this.readData();
            }
            const flow = this.flow;

            flow.changeAddEdgeModel({
                shape: 'flow-polyline-round'
            });

            // 输入锚点不可以连出边
            flow.on('hoveranchor:beforeaddedge', ev => {
                this.pushMsg(ev.anchor)
                if (ev.anchor.anchorType === 'input') {
                    ev.cancel = true;
                }
            });
            flow.on('dragedge:beforeshowanchor', ev => {
                // 只允许目标锚点是输入，源锚点是输出，才能连接
                if (!(ev.targetAnchor.anchorType === 'input' && ev.sourceAnchor.anchorType === 'output')) {
                    ev.cancel = true;
                }
                // 不允许自己连自己
                if (ev.target.id === ev.source.id) {
                    ev.cancel = true;
                }
                // 判断数据类型
                if (ev.targetAnchor.type.toString() !== ev.sourceAnchor.type.toString()) {
                    ev.cancel = true;
                }
                // 如果拖动的是目标方向，则取消显示目标节点中已被连过的锚点
                if (ev.dragEndPointType === 'target' && flow.anchorHasBeenLinked(ev.target, ev.targetAnchor)) {
                    ev.cancel = true;
                }
                // 如果拖动的是源方向，则取消显示源节点中已被连过的锚点
                if (ev.dragEndPointType === 'source' && flow.anchorHasBeenLinked(ev.source, ev.sourceAnchor)) {
                    ev.cancel = true;
                }
            });

            // 拖拽node移动，连续的
            const graph = this.flow.getGraph();
            graph.on('node:dragstart', ev => {
                const { item } = ev;
                const model = item.getModel();

                const dx = model.x - ev.x;
                const dy = model.y - ev.y;
                let node = item;
                let moveE = null;

                graph.on('node:drag', ev => {
                    moveE = ev;
                    node && graph.update(node, {
                        x: ev.x + dx,
                        y: ev.y + dy
                    });
                });
                graph.on('node:dragend', ev => {
                    node && graph.update(node, {
                        x: moveE.x + dx,
                        y: moveE.y + dy
                    });

                    node = null;
                    graph.removeEvent('node:dragend');
                    graph.removeEvent('node:drag')
                });

            });
        },
        methods: {
            terminalFor(component) {
                this.showTerminal = true;
                this.terminalIs = component;
                $('.context-menu', this.$el).hide();
                this.$nextTick(() => {
                    this.terminalIs = ''
                })
            },
            ctrl192() {
                this.showTerminal = !this.showTerminal;
            },
            goBack(bol) {
                if (bol) {
                    this.$nextTick(() => {
                        this.$router.go(-1)
                    })
                    return;
                }
                if (!this.isEdited()) {
                    this.$nextTick(() => {
                        this.$router.go(-1)
                    })
                    return;
                }
                this.$confirm('确认放弃修改当前流程?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$nextTick(() => {
                        this.$router.go(-1)
                    })
                })
            },
            readData() {
                this.pushMsg(this.flowData)
                this.flow.read(this.flowData)
            },
            isEdited() {
                const editData = JSON.stringify({ flowData: this.flow.save(), name: this.name });
                const cacheData = JSON.stringify({ flowData: this.designItem.flowData, name: this.designItem.name });
                if (editData === cacheData) {
                    return false;
                }
                return true;
            },
            saveData() {
                if (!this.isEdited()) {
                    this.$message({
                        message: '流程并没有更改！',
                        type: 'warning'
                    })
                    return;
                }
                this.$confirm('确认保存当前流程?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.saveDesign();
                })
            },
            saveDesign() {
                let designList = window.localStorage.designList;
                if (designList) {
                    designList = JSON.parse(designList)
                } else {
                    designList = [];
                }
                if (!this.designItem.id) {
                    Object.assign(this.designItem, {
                        id: uuidv1(),
                        ts: this.$moment().format(),
                        cts: this.$moment().format(),
                        name: this.name,
                        flowData: this.flow.save(),
                        active: false
                    })
                    designList.unshift(this.designItem)
                    window.localStorage.designList = JSON.stringify(designList);
                } else {
                    const li = designList.find(d => d.id === this.designItem.id);
                    Object.assign(li, { name: this.name, flowData: this.flow.save(), ts: this.$moment().format() })
                    designList.sort((a, b) => this.$moment(b.ts).valueOf() - this.$moment(a.ts).valueOf())
                    window.localStorage.designList = JSON.stringify(designList);
                }
                this.$nextTick(() => {
                    this.$router.push({ path: '/design/designList', query: { reload: true } })
                })
            },
            changeEage(type) {
                this.flow.changeAddEdgeModel({
                    shape: type
                });
            }
        },
        watch: {
            '$route.params': function(p) {
                if (p.flow) {
                    this.data = p.flow.flowData;
                    this.readData();
                }
            }
        }
    };
</script>
<style lang="scss">
    .editor {
        position: relative;
        height: 100%;
        .tool-tip {
            list-style: none;
            font-size: 13px;
            background: #fff;
            color: #333;
            border-radius: 4px;
            padding: 5px 10px;
            box-shadow: 0 0 10px 0 rgb(0, 0, 0);
            .tip-title {
                color: #777;
                font-size: 15px;
                margin-bottom: 10px;
                font-weight: bold;
            }
        }
        .design-name {
            width: 100px;
        }
        ::-webkit-scrollbar {
            width: 7px;
            height: 7px;
        }
        .go-back {
            position: absolute;
            right: 0;
            top: 5px;
            z-index: 1;
            display: flex;
            color: #ccc;
            text-align: right;
            align-items: center;
            .name-input {
                margin-right: 30px;
            }
            .el-input {
                height: 36px;
                width: 160px;
                .el-input__inner {
                    height: 36px;
                    line-height: 36px;
                    background: none;
                    border: none;
                    border-radius: 0;
                    border-bottom: 1px solid #aaa;
                    color: #eee;
                }
            }
            .btns {
                width: 230px;
            }
        }
        .bottom-container {
            height: calc(100% - 52px);
            position: relative;
        }
        .pannel-title {
            height: 32px;
            background: #666;
            color: #eee;
            line-height: 32px;
            padding-left: 12px;
            font-size: 15px;
        }
        .color-picker {
            vertical-align: middle;
            margin-left: 16px;
        }
    }
</style>
