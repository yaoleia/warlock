<template>
    <keep-alive>
        <router-view :editorLoaded='editorLoaded'></router-view>
    </keep-alive>
</template>
<style>
</style>
<script type="babel">
    import { SET_ALGORITHM_MAP } from '../../store/app/mutation-type'
    export default {
        components: {},
        data() {
            return {
                editorLoaded: null
            };
        },
        methods: {
            async init() {
                const G6Editor = await import('@antv/g6-editor')
                const Flow = G6Editor.Flow;
                // 注册模型卡片基类
                Flow.registerNode('model-card', {
                    draw(item) {
                        const group = item.getGraphicGroup();
                        const model = item.getModel();
                        const width = 200;
                        const height = 40;
                        const x = -width / 2;
                        const y = -height / 2;
                        const borderRadius = 4;

                        // 生成锚点
                        const outputs = this.exec_outputs;
                        const inputs = this.exec_params;
                        const inLength = Object.keys(inputs).length;
                        const outLength = Object.keys(outputs).length;
                        const inAnchors = Object.keys(inputs).map((ii, index) => {
                            return [(index + 1) / (inLength + 1), 0, { name: ii, type: inputs[ii].type, anchorType: 'input' }]
                        })
                        const outAnchors = Object.keys(outputs).map((oo, index) => {
                            return [(index + 1) / (outLength + 1), 1, { name: oo, type: outputs[oo].type, anchorType: 'output' }]
                        })
                        this.anchor = [...inAnchors, ...outAnchors];

                        // 如果是新模块,则把注册数据安到model上
                        if (!model.module) {
                            const { type, author, create_time, dependencies, exec_outputs, exec_params, init_params, module, version } = this;
                            Object.assign(model, { type, author, create_time, dependencies, exec_outputs, exec_params, init_params, module, version, anchor: this.anchor.map(a => a[2]) })
                        }

                        // 生成元素
                        const keyShape = group.addShape('rect', {
                            attrs: {
                                x,
                                y,
                                width,
                                height,
                                radius: borderRadius,
                                fillOpacity: 0.2,
                                strokeOpacity: 0.7,
                                fill: '#fff',
                                stroke: '#fff'
                            }
                        });

                        // 左侧色条
                        // const aaa = group.addShape('path', {
                        //     attrs: {
                        //         path: [
                        //             ['M', x, y + borderRadius],
                        //             ['L', x, y + height - borderRadius],
                        //             ['A', borderRadius, borderRadius, 0, 0, 0, x + borderRadius, y + height],
                        //             ['L', x + borderRadius, y],
                        //             ['A', borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius]
                        //         ],
                        //         fill: this.color_type
                        //     }
                        // });

                        // 名称
                        const a = group.addShape('text', {
                            attrs: {
                                fontSize: 17,
                                text: this.module,
                                x: x + 20,
                                y: y + 10,
                                textAlign: 'start',
                                textBaseline: 'top',
                                fill: '#ff8800'
                            }
                        });

                        // buildOpt(this.checkBoxList, this.optionList, x, y);
                        function buildOpt(attrs, options, x, y) {
                            x = x + 20;
                            y = y + 10;
                            if (attrs) {
                                attrs.map(attr => {
                                    const { key } = attr;
                                    y += 30;
                                    group.addShape('text', {
                                        attrs: {
                                            text: key,
                                            x,
                                            y,
                                            textAlign: 'start',
                                            textBaseline: 'top',
                                            fill: 'rgba(0,0,0,0.65)'
                                        }
                                    });
                                    group.addShape('text', {
                                        attrs: {
                                            text: model.checkedBox && model.checkedBox.includes(key) ? 'on' : 'off',
                                            x: x + 150,
                                            y,
                                            textAlign: 'start',
                                            textBaseline: 'top',
                                            fill: 'rgba(0,0,0,0.65)'
                                        }
                                    });
                                })
                            }
                            if (options) {
                                options.map(option => {
                                    const { key } = option;
                                    y += 30;
                                    group.addShape('text', {
                                        attrs: {
                                            text: key,
                                            x,
                                            y,
                                            textAlign: 'start',
                                            textBaseline: 'top',
                                            fill: 'rgba(0,0,0,0.65)'
                                        }
                                    });
                                    group.addShape('text', {
                                        attrs: {
                                            text: model[key] === undefined ? '' : model[key],
                                            x: x + 130,
                                            y,
                                            textAlign: 'start',
                                            textBaseline: 'top',
                                            fill: 'rgba(0,0,0,0.65)'
                                        }
                                    });
                                })
                            }
                        }

                        return keyShape;
                    }
                });

                for (const key in this.algorithmConf) {
                    const value = this.algorithmConf[key]
                    Flow.registerNode(value.module, {
                        ...value,
                        color_type: '#1890FF'
                    }, 'model-card');
                }

                Flow.registerEdge('line', {
                    draw(item) {
                        const model = item.getModel();
                        const group = item.getGraphicGroup();
                        const path = this.getPath(item);
                        const x = (path[0][1] + path[1][1]) / 2
                        const y = (path[0][2] + path[1][2]) / 2

                        // const width = 20;

                        const aaa = group.addShape('path', {
                            attrs: {
                                path,
                                lineWidth: 2,
                                stroke: '#ccc',
                                endArrow: true,
                                lineDash: [10, 10]
                            }
                        });

                        // 名称文本
                        group.addShape('text', {
                            attrs: {
                                text: model.label || '',
                                x,
                                y,
                                textAlign: 'start',
                                textBaseline: 'top',
                                fill: 'rgba(0,0,0,0.65)',
                                stroke: '#CED4D9'
                            }
                        });
                        return aaa;
                    },
                    getPath(item) {
                        const points = item.getPoints();
                        return G6Editor.Util.pointsToPolygon(points);
                    },
                    afterDraw: function afterDraw(item) {
                        const keyShape = item.getKeyShape();
                        keyShape.attr('lineDashOffset', 0);
                        keyShape.animate({
                            lineDashOffset: -20,
                            repeat: true
                        }, 500);
                    }
                });
            }
        },
        computed: {
            algorithmConf() {
                return this.$store.state.algorithmMap;
            }
        },
        async beforeMount() {
            this.editorLoaded = $.Deferred();
            const resp = await this.$store.dispatch(SET_ALGORITHM_MAP)
            await this.init()
            this.editorLoaded.resolve();
        }
    };
</script>