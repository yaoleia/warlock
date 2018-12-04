<template>
    <div class="design-list">
        <div class="search">
            <el-date-picker v-model="q.dateRange" type="datetimerange" :picker-options="pickerOptions" start-placeholder="开始时间" end-placeholder="结束时间" align="left" value-format="timestamp">
            </el-date-picker>
            <el-button class="search-button" type="text" @click="q.pageIndex = 1;query()">查询</el-button>
            <router-link to='/design/designer/0'>
                <el-button class="search-button" type="text">新建</el-button>
            </router-link>
        </div>
        <el-table stripe :data="designList" v-loading="loading" :height="innerHeight">
            <div slot="empty">
                <p v-if='!loading'>No Content</p>
            </div>
            <el-table-column type="index" width="55" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="name" label="流程名称" width="300">
            </el-table-column>
            <el-table-column label="预览">
                <template slot-scope="scope">
                    <flow-displayer :flowData='scope.row.flowData' class="flow-wrap"></flow-displayer>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="300">
                <template slot-scope="scope">
                    <span v-text="$moment().format('YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="最后修改时间" width="300">
                <template slot-scope="scope">
                    <span v-text="$moment().format('YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <router-link :to="{name: '添加流程',params: {id:scope.row.id,flow: scope.row}}" tag="div">
                        <el-button type="text">修改</el-button>
                    </router-link>
                    <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <el-button type="text" @click="handleSelectionChange(scope.$index, scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background class="pager" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="q.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="q.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>
<script type="babel">
    import FlowDisplayer from 'component/ModelFlowEditor/displayer'
    export default {
        data() {
            return {
                total: 30,
                designList: [],
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近3小时',
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 3)
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            text: '最近24小时',
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24)
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            text: '最近72小时',
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 72)
                                picker.$emit('pick', [start, end])
                            }
                        }
                    ]
                },
                q: {
                    pageIndex: 1,
                    pageSize: 20,
                    dateRange: '',
                    endTime: ''
                },
                // 请求时的loading效果
                loading: false
            }
        },
        components: {
            FlowDisplayer
        },
        methods: {
            handleEdit(a, b) { console.log(b) },
            handleDelete(index, item) {
                this.$delete(this.designList, index);
            },
            indexMethod(index) {
                return (this.q.pageIndex - 1) * this.q.pageSize + index + 1
            },
            getDesignList(store, json) {
                if (EASY_ENV_IS_BROWSER) {
                    this.loading = true;
                }
                this.designList = [
                    {
                        ts: 1,
                        cts: 2,
                        name: 'wade',
                        id: 1,
                        flowData: { nodes: [{ shape: 'distortion-correction', type: 'node', size: '200*250', x: 58.5, y: 49.5, id: 'b9ae7b66', index: 0, checkedBox: [] }, { shape: 'distortion-correction', type: 'node', size: '200*250', x: 264.5, y: 113.5, id: 'b2678761', index: 1, checkedBox: [] }] }
                    }, {
                        ts: 1,
                        cts: 2,
                        name: 'haha',
                        id: 2,
                        flowData: { nodes: [{ shape: 'distortion-correction', type: 'node', size: '200*250', x: 99.5, y: 543.5, id: '4603208a', index: 0, checkedBox: [] }, { shape: 'bar-code-recognition', type: 'node', size: '200*250', x: 121.5, y: 140.5, id: 'd0c76fd4', index: 1, checkedBox: [] }] }
                    },
                    {
                        ts: 1,
                        cts: 2,
                        name: 'jame',
                        id: 3,
                        flowData: { nodes: [{ shape: 'distortion-correction', type: 'node', size: '200*250', x: 236, y: 201.5, id: '7762261d', index: 0, checkedBox: [] }, { shape: 'distortion-correction', type: 'node', size: '200*250', x: 470, y: 205.5, id: 'f313edca', index: 1, checkedBox: [] }, { shape: 'image-registration', type: 'node', size: '200*250', x: 332, y: 479.5, id: '37286ddf', index: 2, checkedBox: [] }] }
                    },
                    {
                        ts: 1,
                        cts: 2,
                        name: 'james',
                        id: 4,
                        flowData: { nodes: [{ shape: 'distortion-correction', type: 'node', size: '200*250', x: 332, y: 258.5, id: '6dd5bf6c', index: 0, checkedBox: [] }, { shape: 'image-registration', type: 'node', size: '200*250', x: 658, y: 439.5, id: '0bc9bf89', index: 2, checkedBox: [] }, { shape: 'bar-code-recognition', type: 'node', size: '200*250', x: 199, y: 539.5, id: 'e8079a5f', index: 3, checkedBox: [] }, { shape: 'distortion-correction', type: 'node', size: '200*250', x: 605.9129554655871, y: 173.40080971659918, id: '91756993', index: 5, checkedBox: [] }, { shape: 'image-compression', type: 'node', size: '200*250', x: 135.73211875843455, y: 174.13090418353576, id: 'ef8c5dd8', index: 6, checkedBox: [] }, { shape: 'bar-code-recognition', type: 'node', size: '200*250', x: 701.5553306342781, y: 653.8029689608636, id: 'd6e93488', index: 7, checkedBox: [] }, { shape: 'image-registration', type: 'node', size: '200*250', x: 498.58906882591094, y: 674.9757085020242, id: 'be1e6b6b', index: 8, checkedBox: [] }], edges: [{ shape: 'flow-polyline-round', source: '6dd5bf6c', sourceAnchor: 1, target: '0bc9bf89', targetAnchor: 0, id: '4bf43d88', index: 1 }, { shape: 'flow-polyline-round', source: 'e8079a5f', sourceAnchor: 0, target: '6dd5bf6c', targetAnchor: 0, id: 'ad940302', index: 4 }] }
                    }
                ]
                this.loading = false;
            },
            query() {
                this.getDesignList();
            },
            handleSelectionChange(val, obj) {
                this.dialogDetailVisible = true
            },
            handleSizeChange(val) {
                this.q.pageSize = val
                this.getDesignList(this.$store, this.q)
            },
            handleCurrentChange(val) {
                this.q.pageIndex = val
                this.getDesignList(this.$store, this.q)
            },
            async init() {
                const G6Editor = await import('@antv/g6-editor')
                const Flow = G6Editor.Flow;
                Flow.registerNode('factory-card', {
                    draw(item) {
                        const group = item.getGraphicGroup();
                        const model = item.getModel();
                        const width = 100;
                        const height = 100;
                        const x = -width / 2;
                        const y = -height / 2;
                        const keyShape = group.addShape('image', {
                            attrs: {
                                x,
                                y,
                                width,
                                height,
                                img: factory
                            }
                        });
                        if (model.label) {
                            group.addShape('text', {
                                attrs: {
                                    text: model.label,
                                    x: 0,
                                    y: y - 10,
                                    textAlign: 'center',
                                    textBaseline: 'top',
                                    fill: model.color ? model.color : 'rgba(255,255,255,0.65)'
                                }
                            });
                        }
                        return keyShape;
                    },
                    // 设置锚点
                    anchor: [
                        [1, 0.5, {
                            type: 'output'
                        }], // 上面边的中点
                        [0, 0.5, {
                            type: 'input'
                        }] // 下边边的中点
                    ]
                });

                // 注册模型卡片基类
                Flow.registerNode('model-card', {
                    draw(item) {
                        const group = item.getGraphicGroup();
                        const model = item.getModel();
                        const width = 200;
                        const height = 250;
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
                        buildOpt(this.checkBoxList, this.optionList, x, y);
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

                // 畸变校正
                Flow.registerNode('distortion-correction', {
                    title: '畸变校正',
                    color_type: '#1890FF',
                    type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
                    state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
                    checkBoxList: [{ key: 'wade' }, { key: 'james' }],
                    optionList: [{ key: 'frameRate' }, { key: 'gamma' }]
                }, 'model-card');

                // 图像压缩
                Flow.registerNode('image-compression', {
                    title: '图像压缩',
                    label: '随机森林',
                    color_type: '#9254DE',
                    type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
                    state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
                    // 设置锚点
                    anchor: [
                        [0.5, 0, {
                            type: 'input'
                        }],
                        [0.5, 1, {
                            type: 'output'
                        }]
                    ]
                }, 'model-card');

                // 图像配准
                Flow.registerNode('image-registration', {
                    title: '图像配准',
                    label: 'image-registration 分类',
                    color_type: '#1890FF',
                    type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
                    state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
                    // 设置锚点
                    anchor: [
                        [0.5, 0, {
                            type: 'input'
                        }],
                        [0.33, 1, {
                            type: 'output'
                        }],
                        [0.66, 1, {
                            type: 'output'
                        }]
                    ]
                }, 'model-card');

                // 二维码识别
                Flow.registerNode('dm-code-recognition', {
                    title: '二维码识别',
                    label: '二维码识别',
                    color_type: '#9254DE',
                    type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
                    state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/uZVdwjJGqDooqKLKtvGA.svg',
                    // 设置锚点
                    anchor: [
                        [0.5, 0, {
                            type: 'input'
                        }],
                        [0.5, 1, {
                            type: 'output'
                        }]
                    ]
                }, 'model-card');

                // 条码识别
                Flow.registerNode('bar-code-recognition', {
                    title: '条码识别',
                    label: 'bar',
                    color_type: '#FAAD14',
                    type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
                    state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
                    // 设置锚点
                    anchor: [
                        [0.5, 1, {
                            type: 'output'
                        }]
                    ]
                }, 'model-card');

                // const MIN_ARROW_SIZE = 3;
                // Flow.registerEdge('line', {
                //     draw(item) {
                //         const group = item.getGraphicGroup();
                //         const path = this.getPath(item);

                //         let aaa = group.addShape('path', {
                //             attrs: {
                //                 path,
                //                 stroke: 'black',
                //                 lineWidth: 1,
                //                 endArrow: true,
                //                 lineDash: [20, 10]
                //             }
                //         });

                //         console.log(aaa);
                //         return aaa;
                //     },
                //     getPath(item) {
                //         const points = item.getPoints();
                //         let point1 = points[0];
                //         let point2 = points[1];
                //         const lightningWidth = 20;
                //         let newPoints = [point1, {
                //             x: (point1.x + point2.x) / 2,
                //             y: ((point1.y + point2.y) / 2 + lightningWidth)
                //         }, {
                //             x: (point1.x + point2.x) / 2 + lightningWidth,
                //             y: ((point1.y + point2.y) / 2 - lightningWidth)
                //         }, point2];
                //         return G6Editor.Util.pointsToPolygon(newPoints);
                //     },
                //     endArrow: {
                //         path(item) {
                //             const keyShape = item.getKeyShape();
                //             let lineWidth = keyShape.attr('lineWidth');
                //             lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
                //             const width = lineWidth * 10 / 3;
                //             const halfHeight = lineWidth * 4 / 3;
                //             const radius = lineWidth * 4;
                //             return [
                //                 [ 'M', -width, halfHeight ],
                //                 [ 'L', 0, 0 ],
                //                 [ 'L', -width, -halfHeight ],
                //                 [ 'A', radius, radius, 0, 0, 1, -width, halfHeight ],
                //                 [ 'Z' ]
                //             ];
                //         },
                //         shorten(item) {
                //             const keyShape = item.getKeyShape();
                //             const lineWidth = keyShape.attr('lineWidth');
                //             return (lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE) * 3.1;
                //         },
                //         style(item) {
                //             const keyShape = item.getKeyShape();
                //             const { strokeOpacity, stroke } = keyShape.attr();
                //             return {
                //                 fillOpacity: strokeOpacity,
                //                 fill: stroke
                //             };
                //         }
                //     }
                // });

                // Flow.registerEdge('line', {
                //     draw(item) {
                //         const group = item.getGraphicGroup();
                //         const path = this.getPath(item);

                //         let aaa = group.addShape('path', {
                //             attrs: {
                //                 path,
                //                 stroke: 'black',
                //                 lineWidth: 1,
                //                 endArrow: false,
                //                 fillStyle: ''
                //             }
                //         });

                //         console.log(aaa);
                //         return aaa;
                //     },
                //     getPath(item) {
                //         const points = item.getPoints();
                //         let point1 = points[0];
                //         let point2 = points[1];
                //         let strokeWidth = 10;
                //         let arrowWidth = 30;
                //         let arrowHeigh = 30;
                //         let newPoints = [{
                //             x: point1.x,
                //             y: point1.y - strokeWidth / 2
                //         }, {
                //             x: point2.x - arrowWidth,
                //             y: point2.y - strokeWidth / 2
                //         }, {
                //             x: point2.x - arrowWidth,
                //             y: point2.y - arrowHeigh / 2
                //         }, {
                //             x: point2.x,
                //             y: point2.y
                //         }, {
                //             x: point2.x - arrowWidth,
                //             y: point2.y + arrowHeigh / 2
                //         }, {
                //             x: point2.x - arrowWidth,
                //             y: point2.y + strokeWidth / 2
                //         }, {
                //             x: point1.x,
                //             y: point1.y + strokeWidth / 2
                //         },
                //         {
                //             x: point1.x,
                //             y: point1.y - strokeWidth / 2
                //         }];
                //         return G6Editor.Util.pointsToPolygon(newPoints);
                //     }
                // });

                // const MIN_ARROW_SIZE = 3;
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


                        // const points = item.getPoints();
                        // const point1 = points[0];
                        // const point2 = points[1];
                        // const shorten = (width > MIN_ARROW_SIZE ? width : MIN_ARROW_SIZE) * 3.1;
                        // group.addShape('path', {
                        //     attrs: {
                        //         path: G6Editor.Util.pointsToPolygon([
                        //             {x: point1.x, y: point1.y + width / 2},
                        //             {x: point1.x, y: point1.y - width / 2},
                        //             {x: point2.x - shorten, y: point2.y - width / 2},
                        //             {x: point2.x - shorten, y: point2.y + width / 2},
                        //             {x: point1.x, y: point1.y + width / 2}]),
                        //         stroke: 'black',
                        //         lineWidth: 1
                        //     }
                        // });

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
                    // ,
                    // endArrow: {
                    //     path(item) {
                    //         const keyShape = item.getKeyShape();
                    //         let lineWidth = keyShape.attr('lineWidth');
                    //         lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
                    //         const width = lineWidth * 10 / 3;
                    //         const halfHeight = lineWidth * 4 / 3;
                    //         return [
                    //             [ 'M', -width, halfHeight ],
                    //             [ 'L', 0, 0 ],
                    //             [ 'L', -width, -halfHeight ],
                    //             [ 'L', -width, halfHeight ],
                    //             [ 'Z' ]
                    //         ];
                    //     },
                    //     shorten(item) {
                    //         const keyShape = item.getKeyShape();
                    //         const lineWidth = keyShape.attr('lineWidth');
                    //         return (lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE) * 3.1;
                    //     },
                    //     style(item) {
                    //         const keyShape = item.getKeyShape();
                    //         const { strokeOpacity, stroke } = keyShape.attr();
                    //         return {
                    //             fillOpacity: strokeOpacity,
                    //             fill: stroke
                    //         };
                    //     }
                    // }
                });
            }
        },
        computed: {
            innerHeight() {
                if (EASY_ENV_IS_BROWSER) {
                    if (window.innerWidth <= 1920) {
                        return 620;
                    } else {
                        return 890;
                    }
                } else {
                    return 400
                }
            }
        },
        activated() {
            if (this.$route.params.reload) {
                this.getDesignList()
            }
        },
        beforeMount() {
            this.init();
            if (!(this.designList && this.designList.length > 0)) {
                this.getDesignList(this.$store, this.q)
            }
        },
        watch: {
            'q.dateRange': function(r) {
                if (r === null) {
                    this.q.pageIndex = 1
                    this.query()
                }
            },
            designList(i) {
                $('.el-table__body-wrapper', this.$el)[0].scrollTop = 0;
                this.loading = false;
            }
        }
    }
</script>

<style lang="scss">
    .design-list {
        min-height: 500px;
        .el-table {
            height: 890px;
            .cell .red {
                color: #f44336;
            }
            .cell .flow-wrap {
                width: 300px;
                height: 200px;
                margin: 0 auto;
            }
            .el-loading-mask {
                background: rgba(0, 0, 0, 0.2);
            }
            .dm-code-img-wrap {
                cursor: zoom-in;
                height: 40px;
                margin: 0 70px;
                img {
                    height: 100%;
                }
            }
        }
        .search {
            height: 40px;
            .el-range-editor {
                border: none;
            }
            .el-range-editor .el-range-input {
                background: none;
                color: #dbdbdb;
            }
            .el-input__inner {
                background: rgba($color: #fff, $alpha: 0.1);
            }
            .el-date-editor .el-range-separator {
                color: #aaa;
            }
        }
    }
    @media screen and (max-width: 1920px) {
        .design-list {
            .el-table {
                height: 621px;
            }
        }
    }
</style>