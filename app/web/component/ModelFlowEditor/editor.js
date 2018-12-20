
import G6Editor from '@antv/g6-editor'
import CircularJSON from 'circular-json'
import G6Plugins from '@antv/g6/build/plugins'
G6Editor.track(false)
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

            graph.on('click', ev => {
                if (!ev.item) return;
                this.pushMsg(ev.item.getModel(), 'click')
            });

            flow.on('afteritemselected', ev => {
                this.selectedModel = ev.item.getModel();
            });

            flow.on('afterzoom', ev => {
                this.curZoom = ev.updateMatrix[0];
                this.pushMsg(this.curZoom, 'zoom')
            });

            flow.on('afterchange', ev => {
                const { action, item } = ev;
                if (item && item.model) {
                    this.pushMsg(item.model, action)
                    return;
                }
                this.pushMsg(action)
            });

            // 输入锚点不可以连出边
            flow.on('hoveranchor:beforeaddedge', ev => {
                if (this.readMode) {
                    ev.cancel = true;
                }
                this.pushMsg(ev.anchor, 'anchor:hover')
                if (ev.anchor.anchorType === 'input') {
                    ev.cancel = true;
                }
            });
            flow.on('dragedge:beforeshowanchor', ev => {
                if (this.readMode) {
                    ev.cancel = true;
                }
                // 只允许目标锚点是输入，源锚点是输出，才能连接
                if (!(ev.targetAnchor.anchorType === 'input' && ev.sourceAnchor.anchorType === 'output')) {
                    ev.cancel = true;
                }
                // 不允许自己连自己
                if (ev.target.id === ev.source.id) {
                    ev.cancel = true;
                }

                // 判断数据类型
                if (ev.targetAnchor.type && ev.sourceAnchor.type) {
                    if (ev.targetAnchor.type.toString() !== ev.sourceAnchor.type.toString()) {
                        ev.cancel = true;
                    }
                }

                // 关掉可能重复的点
                if (flow.anchorHasBeenLinked(ev.target, ev.targetAnchor) || flow.anchorHasBeenLinked(ev.source, ev.sourceAnchor)) {
                    const edges = flow.getEdges();
                    const cancel = edges.some(e => {
                        const model = e.getModel();
                        return model.source === ev.source.id && model.target === ev.target.id && model.sourceAnchor === ev.sourceAnchor.index && model.targetAnchor === ev.targetAnchor.index;
                    })
                    if (cancel) {
                        ev.cancel = true;
                    }
                }
                // 如果拖动的是目标方向，则取消显示目标节点中已被连过的锚点
                // if (ev.dragEndPointType === 'target' && flow.anchorHasBeenLinked(ev.target, ev.targetAnchor)) {
                //     ev.cancel = true;
                // }
                // 如果拖动的是源方向，则取消显示源节点中已被连过的锚点
                // if (ev.dragEndPointType === 'source' && flow.anchorHasBeenLinked(ev.source, ev.sourceAnchor)) {
                //     ev.cancel = true;
                // }
            });

            // ==========================查看模式,不用加载的一些组件==========================
            if (params.read) {
                return
            }

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
        modelFilter(model) {
            const { anchor, exec_outputs, exec_params, init_params, shape, size, x, y, index, ...msgFilt } = model;
            return CircularJSON.stringify(msgFilt);
        },
        pushMsg(msg, action) {
            if (typeof msg === 'object') {
                this._pushMsg(this.modelFilter(msg), action);
                return;
            }
            this._pushMsg(msg, action);
        },
        _pushMsg(newMsg, action) {
            if (action) {
                newMsg = action + ' ' + newMsg;
            }
            if (newMsg === this.msgList[this.msgList.length - 1]) return;
            this.msgList.push(newMsg)
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