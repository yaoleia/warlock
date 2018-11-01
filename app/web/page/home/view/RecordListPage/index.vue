<template>
    <div class="history-list">
        <div class="search">
            <!-- <label> 标题:</label>
                <el-input class="search-input" clearable v-model="q.title" placeholder="关键字"></el-input>
                <label> 分类:</label>
                <el-select v-model="q.categoryId" placeholder="分类">
                    <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.categoryId">
                    </el-option>
                </el-select>
                <label> 状态:</label>
                <el-select v-model="q.status" placeholder="状态">
                    <el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.status">
                    </el-option>
                </el-select> -->
            <el-date-picker v-model="q.dateRange" type="datetimerange" :picker-options="pickerOptions" start-placeholder="开始时间" end-placeholder="结束时间" align="left" value-format="timestamp">
            </el-date-picker>
            <el-button class="search-button" type="text" @click="q.pageIndex = 1;query()">查询</el-button>
        </div>
        <el-table stripe :data="articleList" v-loading="loading" :height="innerHeight">
            <div slot="empty">
                <p v-if='!loading'>No Content</p>
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
                    <span v-text="$moment(props.row.detect_time-0).format('YYYY-MM-DD HH:mm:ss')"></span>
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
    import DialogDetail from "./DialogDetail.vue"
    import { SET_ARTICLE_LIST, DELETE_ARTICLE } from "../../store/app/mutation-type"
    import utils from "framework/utils"
    let curObj = {
        cutBase64: "",
        defect_type: "",
        dm_code: "",
        mask_img_path: "",
        seg_img_path: "",
        reg_img_path: "",
        detect_time: "",
        dm_path: "",
        cut: {}
    }
    export default {
        components: {
            DialogDetail
        },
        data() {
            return {
                pickerOptions: {
                    shortcuts: [
                        {
                            text: "最近3小时",
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 3)
                                picker.$emit("pick", [start, end])
                            }
                        },
                        {
                            text: "最近24小时",
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24)
                                picker.$emit("pick", [start, end])
                            }
                        },
                        {
                            text: "最近72小时",
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 72)
                                picker.$emit("pick", [start, end])
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
                    dateRange: "",
                    endTime: ""
                },
                //请求时的loading效果
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
                let i = this.articleList.findIndex(l => {
                    return this.cur.dm_code === l.dm_code
                })
                if (n === 0) {
                    if (i > 0) {
                        this.cur = { ...curObj, ...this.articleList[--i] }
                    }
                }
                if (n === 1) {
                    if (i < this.articleList.length - 1) {
                        this.cur = { ...curObj, ...this.articleList[++i] }
                    }
                }
                this.leftDisabled = i === 0 ? true : false;
                this.rightDisabled = i === this.articleList.length - 1 ? true : false;
            },
            next() { },
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
                return store.dispatch(SET_ARTICLE_LIST, json).catch(error => {
                    this.$message.error(`请求失败 ${error.response.status}`);
                    this.loading = false;
                })
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
                let msg = utils.defectType(type)
                return msg === "无缺陷" ? "-" : msg
            }
        },
        computed: {
            innerHeight() {
                if (EASY_ENV_IS_BROWSER) {
                    return window.innerHeight - 335
                } else {
                    return 400
                }
            },
            status() {
                return [
                    { status: undefined, name: "--请选择--" },
                    { status: 1, name: "已发布" },
                    { status: 2, name: "草稿" }
                ]
            },
            categories() {
                return [
                    { categoryId: 0, name: "--请选择--" },
                    { categoryId: 1, name: "Nodejs" },
                    { categoryId: 2, name: "Webpack" },
                    { categoryId: 3, name: "Egg" }
                ]
            },
            total() {
                return this.$store.state.articleTotal
            },
            articleList() {
                return this.$store.state.articleList
            }
        },
        beforeMount() {
            if (!(this.articleList && this.articleList.length > 0)) {
                this.fetchApi(this.$store, this.q)
            }
        },
        watch: {
            "q.dateRange": function (r) {
                if (r === null) {
                    this.q.pageIndex = 1
                    this.query()
                }
            },
            "articleList": function (i) {
                $(".el-table__body-wrapper", this.$el)[0].scrollTop = 0;
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
    	width: 1900px;
    	min-height: 500px;
    	padding: 30px 0 0;
    	margin: 0 auto;
    	.el-table {
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
    		width: 1420px;
    	}
    }
</style>