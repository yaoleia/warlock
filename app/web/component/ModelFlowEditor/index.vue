<template>
    <div class="editor">
        <toolbar ref='toolbar' @save="saveData" @read='readData' @change-eage="changeEage" v-show="!readMode" />
        <div class='go-back'>
            <el-button type="text" icon="el-icon-back" v-show="readMode" @click="$router.go(-1)">返回</el-button>
        </div>
        <div class="bottom-container">
            <item-pannel ref="itempannel" v-show="!readMode" />
            <detail-pannel ref='detailpannel' :selected='selected' :selectedModel='selectedModel' @updateGraph='updateGraph' @toggleGrid='toggleGrid' v-show="!readMode" />
            <navigator :cur-zoom="curZoom" :min-zoom="minZoom" :max-zoom="maxZoom" @change-zoom="changeZoom" v-show="!readMode">
                <div ref="minimap" slot="minimap" v-show="!readMode"></div>
            </navigator>
            <page ref="page" />
            <context-menu ref="contextmenu" v-show="!readMode" />
        </div>
    </div>
</template>

<script>
    import DetailPannel from './detailpannel'
    import Navigator from './navigator';
    import ItemPannel from './itempannel'
    import Toolbar from './toolbar';
    import ContextMenu from './context-menu';
    import Page from './page';
    import Editor from './editor.js';

    export default {
        components: {
            Navigator,
            Toolbar,
            ContextMenu,
            Page,
            ItemPannel,
            DetailPannel
        },
        extends: Editor,
        data() {
            return {
                data: { nodes: [{ shape: 'k-means', type: 'node', size: '170*34', x: 133, y: 53.5, id: '937996f0', index: 0 }, { shape: 'image-registration', type: 'node', size: '170*34', x: 424, y: 229.5, id: '30b4457e', index: 1 }, { shape: 'image-registration', type: 'node', size: '170*34', x: 548, y: -40.5, id: 'ce4e0569', index: 2 }, { shape: 'factory-card', type: 'node', size: '100*100', x: 140, y: 275.5, id: '641c17b7', index: 3 }, { shape: 'bar-code-recognition', type: 'node', size: '170*34', x: 72, y: -83.5, id: 'd86391f0', index: 4 }], edges: [{ shape: 'flow-polyline-round', source: 'd86391f0', sourceAnchor: 0, target: '937996f0', targetAnchor: 0, id: '910efbc3', index: 5 }, { shape: 'flow-polyline-round', source: 'ce4e0569', sourceAnchor: 1, target: '30b4457e', targetAnchor: 0, id: '5110776b', index: 6 }, { shape: 'flow-polyline-round', source: 'd86391f0', sourceAnchor: 0, target: 'ce4e0569', targetAnchor: 0, id: 'd7cc81b7', index: 7 }, { shape: 'flow-polyline-round', source: 'ce4e0569', sourceAnchor: 2, target: '641c17b7', targetAnchor: 1, id: 'ed14edea', index: 8 }] }
            };
        },
        computed: {
            readMode() {
                return this.$route.params.read;
            }
        },
        beforeDestroy() {
            this.editor.destroy();
        },
        mounted() {
            const params = this.$route.params;
            this.init(params)
            if (params.flow) {
                this.data = params.flow.flowData;
                this.readData();
            }
            const flow = this.flow;

            flow.changeAddEdgeModel({
                shape: 'flow-polyline-round'
            });

            // 输入锚点不可以连出边
            flow.on('hoveranchor:beforeaddedge', ev => {
                if (ev.anchor.type === 'input') {
                    ev.cancel = true;
                }
            });
            flow.on('dragedge:beforeshowanchor', ev => {
                // 只允许目标锚点是输入，源锚点是输出，才能连接
                if (!(ev.targetAnchor.type === 'input' && ev.sourceAnchor.type === 'output')) {
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
        },
        methods: {
            readData() {
                this.flow.read(this.data)
            },
            saveData() {
                this.data = this.flow.save()
                console.log(JSON.stringify(this.data));
                this.$router.push({ name: '流程列表', params: { reload: true } })
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
        height: 100%;
        .go-back {
            color: #eee;
            text-align: right;
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
