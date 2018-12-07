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
                        const keyShape = group.addShape('rect', {
                            attrs: {
                                x,
                                y,
                                width,
                                height,
                                radius: borderRadius,
                                fill: '#ccc',
                                stroke: '#000'
                            }
                        });
                        // 左侧色条
                        group.addShape('path', {
                            attrs: {
                                path: [
                                    ['M', x, y + borderRadius],
                                    ['L', x, y + height - borderRadius],
                                    ['A', borderRadius, borderRadius, 0, 0, 0, x + borderRadius, y + height],
                                    ['L', x + borderRadius, y],
                                    ['A', borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius]
                                ],
                                fill: this.color_type
                            }
                        });
                        // 名称
                        group.addShape('text', {
                            attrs: {
                                text: this.title,
                                x: x + 20,
                                y: y + 13,
                                textAlign: 'start',
                                textBaseline: 'top',
                                fill: 'rgba(255,0,0,0.65)'
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
                    },
                    // 设置锚点
                    anchor: [
                        [0.5, 0, { type: 'input' }], // 上面边的中点
                        [0.5, 1, { type: 'output' }] // 下边边的中点
                    ]
                });

                for (const key in this.algorithmConf) {
                    const value = this.algorithmConf[key]
                    Flow.registerNode(value.module, {
                        key,
                        title: value.class,
                        color_type: '#1890FF',
                        checkBoxList: [{ key: 'wade' }, { key: 'james' }],
                        optionList: [{ key: 'frameRate' }, { key: 'gamma' }]
                    }, 'model-card');
                }
                // 畸变校正
                // Flow.registerNode('distortion-correction', {
                //     title: '畸变校正',
                //     color_type: '#1890FF',
                //     type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
                //     state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
                //     checkBoxList: [{ key: 'wade' }, { key: 'james' }],
                //     optionList: [{ key: 'frameRate' }, { key: 'gamma' }]
                // }, 'model-card');

                // 图像压缩
                // Flow.registerNode('image-compression', {
                //     title: '图像压缩',
                //     label: '随机森林',
                //     color_type: '#9254DE',
                //     type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
                //     state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
                //     // 设置锚点
                //     anchor: [
                //         [0.5, 0, {
                //             type: 'input'
                //         }],
                //         [0.5, 1, {
                //             type: 'output'
                //         }]
                //     ]
                // }, 'model-card');

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
                                stroke: 'black',
                                // lineWidth: width,
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
                        }, 300);
                    }
                });
            }
        },
        computed: {
            algorithmConf() {
                return this.$store.state.algorithmMap;
            }
        },
        async created() {
            this.editorLoaded = $.Deferred();
            const resp = await this.$store.dispatch(SET_ALGORITHM_MAP)
            await this.init()
            this.editorLoaded.resolve();
        }
    };
</script>