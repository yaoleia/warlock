
import G6Editor from '@antv/g6-editor'
export default {
    data() {
        return {
            selected: {},
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
            const flow = new G6Editor.Flow({
                graph: {
                    container: page.$el,
                    fitView: 'autoZoom',
                    mode: params.read ? 'read' : 'default'
                },
                align: {
                    item: false,
                    grid: true
                },
                noEndEdge: false
            });
            this.flow = flow;
            this.editor = editor;
            editor.add(flow);
            if (params.read) return;
            flow.on('afteritemselected', ev => {
                this.selected = ev;
                this.selectedModel = ev.item.getModel();
                if (!this.selectedModel.checkedBox) {
                    this.selectedModel.checkedBox = [];
                }
                console.log(this.selectedModel);
            });
            flow.on('afterzoom', ev => {
                this.curZoom = ev.updateMatrix[0];
            });
            flow.on('beforechange', ev => {
                console.log(ev)
            });

            const miniMap = new G6Editor.Minimap({
                container: minimap,
                height: 120,
                width: 200
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
            const detailPannel = new G6Editor.Detailpannel({
                container: detailpannel.$el
            });

            // const graph = flow.getGraph();
            // graph.on('click', ev => {
            //     console.log(ev)
            // });
            editor.add(miniMap);
            editor.add(toolBar);
            editor.add(contextMenu);
            editor.add(itemPannel);
            editor.add(detailPannel);
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