<template>
    <div class="history-list">
        <div class="search">
            <el-date-picker v-model="q.dateRange" type="datetimerange" :picker-options="pickerOptions" start-placeholder="开始时间" end-placeholder="结束时间" align="left" value-format="timestamp">
            </el-date-picker>
            <el-button class="search-button" type="text" @click="q.pageIndex = 1;query()">查询</el-button>
        </div>
        <el-table stripe :data="recordList" v-loading="loading" :height="innerHeight">
            <div slot="empty">
                <img class="no-data" src="~asset/images/no-data.png">
            </div>
            <el-table-column type="index" width="55" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="dm_code" label="二维码ID">
            </el-table-column>
            <el-table-column prop="dm_path" label="二维码" width="220">
                <template slot-scope="props">
                    <el-popover placement="right" trigger="hover" popper-class="dm-popper">
                        <div class="dm-pop">
                            <img :src="props.row.dm_path">
                        </div>
                        <div class="dm-code-img-wrap" slot="reference">
                            <img class="dm-code-img" v-if="props.row.dm_path" :src="props.row.dm_path">
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="defect_type" label="OK/NG">
                <template slot-scope="props">
                    <span :class="ifOk(props.row.defect_type) === 'OK'?'':'red'" v-text="ifOk(props.row.defect_type)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="defect_type" label="缺陷类型">
                <template slot-scope="props">
                    <span v-text="defectType(props.row.defect_type)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="detect_time" label="时间">
                <template slot-scope="props">
                    <span v-text="this.$dateFns.format(props.row.detect_time-0,'YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="props">
                    <!-- <router-link :to="{params: {id: props.row.id}}" tag="span">
                        <el-button type="info" size="small" icon="edit" @click="handleEdit(props.$index, props.row)">修改</el-button>
                    </router-link>
                    <el-button type="danger" size="small" icon="delete" @click="handleDelete(props.$index, props.row)">删除</el-button> -->
                    <el-button type="text" icon="delete" @click="handleSelectionChange(props.$index, props.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background class="pager" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="q.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="q.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <el-dialog :append-to-body='true' :visible.sync="dialogDetailVisible" custom-class="dialog-detail-wrap">
            <dialog-detail :cur="cur"></dialog-detail>
            <el-button class='btn-left' :class="{'is-disabled':leftDisabled}" icon="el-icon-arrow-left" type="text" @click="prevOrNext(0)"></el-button>
            <el-button class='btn-right' :class="{'is-disabled':rightDisabled}" icon="el-icon-arrow-right" type="text" @click="prevOrNext(1)"></el-button>
        </el-dialog>
    </div>
</template>
<script type="babel">
    import DialogDetail from './DialogDetail.vue'
    import { SET_RECORD_LIST } from '../../store/app/mutation-type'
    import utils from 'framework/utils'
    const curObj = {
        cutBase64: '',
        defect_type: '',
        dm_code: '',
        mask_img_path: '',
        seg_img_path: '',
        reg_img_path: '',
        detect_time: '',
        dm_path: '',
        cut: {}
    }
    export default {
        components: {
            DialogDetail
        },
        data() {
            return {
                innerHeight: 0,
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
                    title: undefined,
                    categoryId: undefined,
                    statusId: undefined,
                    pageIndex: 1,
                    pageSize: 20,
                    dateRange: '',
                    endTime: ''
                },
                // 请求时的loading效果
                loading: false,
                dialogDetailVisible: false,
                cur: { ...curObj },
                leftDisabled: false,
                rightDisabled: false
            }
        },
        activated() {
            this.getEndTime()
        },
        methods: {
            prevOrNext(n) {
                let i = this.recordList.findIndex(l => {
                    return this.cur.dm_code === l.dm_code
                })
                if (n === 0) {
                    if (i > 0) {
                        this.cur = { ...curObj, ...this.recordList[--i] }
                    }
                }
                if (n === 1) {
                    if (i < this.recordList.length - 1) {
                        this.cur = { ...curObj, ...this.recordList[++i] }
                    }
                }
                this.leftDisabled = i === 0;
                this.rightDisabled = i === this.recordList.length - 1;
            },
            getEndTime() {
                this.q.endTime = new Date().getTime()
            },
            indexMethod(index) {
                return (this.q.pageIndex - 1) * this.q.pageSize + index + 1
            },
            fetchApi(store, json) {
                if (EASY_ENV_IS_BROWSER) {
                    this.loading = true;
                }
                return store.dispatch(SET_RECORD_LIST).catch(error => {
                    this.$message.error(`请求失败 ${error.response.status}`);
                    this.loading = false;
                });
            },
            query() {
                this.fetchApi(this.$store, this.q)
            },
            handleSelectionChange(val, obj) {
                this.dialogDetailVisible = true
                this.cur = { ...curObj, ...obj }
            },
            handleSizeChange(val) {
                this.q.pageSize = val
                this.fetchApi(this.$store, this.q)
            },
            handleCurrentChange(val) {
                this.q.pageIndex = val
                this.fetchApi(this.$store, this.q)
            },
            ifOk(type) {
                return utils.ifOk(type)
            },
            defectType(type) {
                const msg = utils.defectType(type)
                return msg === '无缺陷' ? '-' : msg
            },
            getInnerHeight() {
                if (EASY_ENV_IS_BROWSER) {
                    if (window.innerWidth <= 1920) {
                        this.innerHeight = 620;
                    } else {
                        this.innerHeight = 890;
                    }
                }
            }
        },
        computed: {
            status() {
                return [
                    { status: undefined, name: '--请选择--' },
                    { status: 1, name: '已发布' },
                    { status: 2, name: '草稿' }
                ]
            },
            categories() {
                return [
                    { categoryId: 0, name: '--请选择--' },
                    { categoryId: 1, name: 'Nodejs' },
                    { categoryId: 2, name: 'Webpack' },
                    { categoryId: 3, name: 'Egg' }
                ]
            },
            total() {
                return this.$store.state.recordTotal
            },
            recordList() {
                return this.$store.state.recordList
            }
        },
        beforeMount() {
            if (!(this.recordList && this.recordList.length > 0)) {
                this.fetchApi(this.$store, this.q)
            }
            this.getInnerHeight();
            $(window).on('resize.record', this.getInnerHeight)
        },
        beforeDestroy() {
            $(window).off('resize.record');
        },
        watch: {
            'q.dateRange': function(r) {
                if (r === null) {
                    this.q.pageIndex = 1
                    this.query()
                }
            },
            recordList(i) {
                $('.el-table__body-wrapper', this.$el)[0].scrollTop = 0;
                this.loading = false;
            },
            dialogDetailVisible(bol) {
                if (!bol) {
                    this.cur = { ...curObj }
                }
            }
        }
    }
</script>

<style lang="scss">
    .history-list {
        min-height: 500px;
        .el-table {
            height: 890px;
            .cell .red {
                color: #f44336;
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
        .history-list {
            .el-table {
                height: 621px;
            }
        }
    }
</style>