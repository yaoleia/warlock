
import G6Editor from '@antv/g6-editor'
import CircularJSON from 'circular-json'
import G6Plugins from '@antv/g6/build/plugins'

export default {
    data() {
        return {
            selectedModel: {}, // 当前选中项数据模型
            curZoom: 1, // 当前缩放比率
            minZoom: 0.5, // 最小缩放比率
            maxZoom: 2 // 最大缩放比率
        };
    },
    methods: {
        init(params) {
            const { minimap, toolbar, contextmenu, itempannel, detailpannel, page } = this.$refs;
            // 生成 G6 Editor 编辑器
            const editor = new G6Editor();
            const tooltip = new G6Plugins['tool.tooltip']({
                getTooltip(ev) {
                    const { shape, item } = ev;
                    if (shape.isOutter) return;
                    if (shape.isAnchor) {
                        const anchor = shape.getPoint()
                        return `<ul class='tool-tip'>
                                        <li class='tip-title'>Anchor</li>
                                        <li>name: ${anchor.name}</li>
                                        <li>type: ${anchor.type}</li>
                                        <li>anchorType: ${anchor.anchorType}</li>
                                    </ul>`;
                    }
                    if (item) {
                        const model = item.getModel();
                        if (item.type === 'node') {
                            return `<ul class='tool-tip'>
                                            <li class='tip-title'>Node</li>
                                            <li>id: ${model.id}</li>
                                            <li>module: ${model.module}</li>
                                        </ul>`;
                        }
                        if (item.isEdge) {
                            return `<ul class='tool-tip'>
                                            <li class='tip-title'>Edge</li>
                                            <li>id: ${model.id}</li>
                                            <li>sourceID: ${model.source}</li>
                                            <li>targetID: ${model.target}</li>
                                            <li>shape: ${model.shape}</li>
                                        </ul>`;
                        }
                        if (item.isGroup) {
                            return `<ul class='tool-tip'>
                                            <li class='tip-title'>Group</li>
                                        <li>id: ${model.id}</li>
                            </ul>`;
                        }
                    }
                }
            });

            const flow = new G6Editor.Flow({
                graph: {
                    container: page.$el,
                    plugins: [tooltip]
                },
                align: {
                    item: false,
                    grid: true
                },
                noEndEdge: false
            });
            const detailPannel = new G6Editor.Detailpannel({
                container: detailpannel.$el
            });
            const miniMap = new G6Editor.Minimap({
                container: minimap,
                height: 120,
                width: 200
            });

            this.flow = flow;
            this.editor = editor;

            editor.add(miniMap);
            editor.add(detailPannel);
            editor.add(flow);

            if (params.read) {
                const graph = flow.getGraph();
                graph.on('click', ev => {
                    if (!ev.item) return;
                    this.selectedModel = ev.item.getModel();
                    this.pushMsg(this.selectedModel)
                });
                return;
            }
            // 查看模式,不用加载的一些组件

            flow.on('afteritemselected', ev => {
                this.selectedModel = ev.item.getModel();
                this.pushMsg(this.selectedModel)
            });

            flow.on('afterzoom', ev => {
                this.curZoom = ev.updateMatrix[0];
                this.pushMsg(this.curZoom)
            });

            flow.on('afterchange', ev => {
                this.pushMsg(ev.action)
            });

            const toolBar = new G6Editor.Toolbar({
                container: toolbar.$el
            });
            const contextMenu = new G6Editor.Contextmenu({
                container: contextmenu.$el
            });
            const itemPannel = new G6Editor.Itempannel({
                container: itempannel.$el
            });
            editor.add(toolBar);
            editor.add(contextMenu);
            editor.add(itemPannel);
        },
        pushMsg(msg) {
            if (typeof msg === 'object') {
                const { anchor, exec_outputs, exec_params, init_params, shape, size, x, y, index, ...msgFilt } = msg;
                const newMsg = CircularJSON.stringify(msgFilt);
                if (newMsg === this.msgList[this.msgList.length - 1]) return;
                this.msgList.push(newMsg)
                return;
            }
            this.msgList.push(msg)
        },
        changeZoom(zoom) {
            const flow = this.flow;
            flow.zoom(zoom);
        },
        toggleGrid(checked) {
            const flow = this.flow;
            if (checked) {
                flow.showGrid();
            } else {
                flow.hideGrid();
            }
        },
        updateGraph([key, value] = args) {
            const editor = this.editor;
            editor.executeCommand(() => {
                const flow = this.flow;
                const selectedItems = flow.getSelected();
                selectedItems.forEach(item => {
                    const updateModel = {};
                    updateModel[key] = value;
                    flow.update(item, updateModel);
                });
            });
        }
    }
};