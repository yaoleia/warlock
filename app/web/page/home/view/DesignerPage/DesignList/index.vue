<template>
    <div class="design-list">
        <flow-displayer :flowData='flowData' class="flow-wrap"></flow-displayer>
        <div class="search">
            <el-date-picker v-model="q.dateRange" type="datetimerange" :picker-options="pickerOptions" start-placeholder="开始时间" end-placeholder="结束时间" align="left" value-format="timestamp">
            </el-date-picker>
            <el-button class="search-button" type="text" @click="q.pageIndex = 1;query()">查询</el-button>
        </div>
        <el-table stripe :data="designList" v-loading="loading" :height="innerHeight">
            <div slot="empty">
                <p v-if='!loading'>No Content</p>
            </div>
            <el-table-column type="index" width="55" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="name" label="流程名称" width="300">
            </el-table-column>
            <el-table-column prop="flowData" label="预览">
                <template slot-scope="props">
                    <flow-displayer v-if='props.row.flowData' :flowData='props.row.flowData' class="flow-wrap"></flow-displayer>
                </template>
            </el-table-column>
            <el-table-column prop="ts" label="创建时间" width="300">
                <template slot-scope="props">
                    <span v-text="$moment().format('YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column prop="cts" label="最后修改时间" width="300">
                <template slot-scope="props">
                    <span v-text="$moment().format('YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="props">
                    <router-link :to="{params: {id: props.row.id}}" tag="span">
                        <el-button type="info" size="small" icon="edit" @click="handleEdit(props.$index, props.row)">修改</el-button>
                    </router-link>
                    <el-button type="danger" size="small" icon="delete" @click="handleDelete(props.$index, props.row)">删除</el-button>
                    <el-button type="text" icon="delete" @click="handleSelectionChange(props.$index, props.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background class="pager" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="q.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="q.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>
<script type="babel">
    export default {
        data() {
            return {
                total: 30,
                flowData: { nodes: [{ shape: 'distortion-correction', type: 'node', size: '200*250', x: 514, y: 300.5, id: '1bd78f40', index: 0, checkedBox: [] }, { shape: 'image-compression', type: 'node', size: '200*250', x: 1075, y: 327.5, id: 'eaafde3e', index: 1, checkedBox: [] }], edges: [{ shape: 'flow-polyline-round', source: '1bd78f40', sourceAnchor: 1, target: 'eaafde3e', targetAnchor: 0, id: '16cb3b65', index: 2 }] },
                designList: [
                    {
                        ts: 1,
                        cts: 2,
                        name: 'wade',
                        id: 1,
                        flowData: { nodes: [{ shape: 'distortion-correction', type: 'node', size: '200*250', x: 514, y: 300.5, id: '1bd78f40', index: 0, checkedBox: [] }, { shape: 'image-compression', type: 'node', size: '200*250', x: 1075, y: 327.5, id: 'eaafde3e', index: 1, checkedBox: [] }], edges: [{ shape: 'flow-polyline-round', source: '1bd78f40', sourceAnchor: 1, target: 'eaafde3e', targetAnchor: 0, id: '16cb3b65', index: 2 }] }
                    }
                ],
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
        },
        methods: {
            handleEdit() { },
            handleDelete() { },
            indexMethod(index) {
                return (this.q.pageIndex - 1) * this.q.pageSize + index + 1
            },
            getDesignList(store, json) {
                if (EASY_ENV_IS_BROWSER) {
                    this.loading = true;
                }
            },
            query() {
                // this.getDesignList(this.$store, this.q)
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
        beforeMount() {
            this.$options.components.flowDisplayer = () => import('component/ModelFlowEditor/displayer.vue')
            if (!(this.designList && this.designList.length > 0)) {
                // this.getDesignList(this.$store, this.q)
            }
        },
        watch: {
            'q.dateRange': function (r) {
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
                height: 300px;
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