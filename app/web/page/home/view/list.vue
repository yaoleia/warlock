<script type="babel">
    import imgStream from "component/imgStream"
    import magnifier from "component/magnifier"
    import bigArea from "component/magnifier/bigArea"
    import { SET_ARTICLE_LIST, DELETE_ARTICLE } from "../store/app/mutation-type"
    import utils from "framework/utils"
    let curObj = {
        cutBase64: "",
        defect_type: "",
        dm_code: "",
        mask_img_path: "",
        seg_img_path: "",
        reg_img_path: "",
        detect_time: "",
        dm_img_path: "",
        cut: {}
    }
    export default {
        components: {
            magnifier,
            bigArea,
            imgStream
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
                cur: { ...curObj }
            }
        },
        activated() {
            this.getEndTime()
        },
        methods: {
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
                this.cur = { ...this.cur, ...obj }
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
                    this.$refs.magnifier.close()
                    this.cur = { ...curObj }
                }
            }
        }
    }
</script>
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
        <el-table empty-text='No Content' stripe :data="articleList" v-loading="loading" :height="innerHeight">
            <el-table-column type="index" width="55" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="dm_code" label="二维码ID">
            </el-table-column>
            <el-table-column prop="dm_img_path" label="二维码">
                <template slot-scope="props">
                    <el-popover placement="right" trigger="hover" popper-class="dm-popper">
                        <div class="dm-pop">
                            <img :src="props.row.dm_img_path">
                        </div>
                        <div class="dm-code-img-wrap" slot="reference">
                            <img class="dm-code-img" v-if="props.row.dm_img_path" :src="props.row.dm_img_path">
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
        <el-dialog :visible.sync="dialogDetailVisible">
            <magnifier :imgMagnifier="cur" ref="magnifier">
                <imgStream class="img-big" :url="cur.reg_img_path"></imgStream>
                <imgStream :url="cur.mask_img_path"></imgStream>
            </magnifier>
            <div class="right">
                <big-area class="result" title="局部放大" :opt="cur"></big-area>
                <!-- <imgStream title="目标定位" :url="cur.seg_img_path"></imgStream> -->
                <el-card class="msg">
                    <p class="title">检测结果详情</p>
                    <span>{{cur.dm_code}}</span>
                    <span>{{ifOk(cur.defect_type)}}</span>
                    <span>{{defectType(cur.defect_type)}}</span>
                    <img class="dm-code-img" v-if="cur.dm_img_path" :src="cur.dm_img_path">
                    <p>{{$moment(cur.detect_time-0).format('YYYY-MM-DD HH:mm:ss')}}</p>
                </el-card>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="scss">
    .el-popper.dm-popper {
    	background: #606266;
    	border-color: #909399;
    	.popper__arrow {
    		border-right-color: #909399;
    		&::after {
    			border-right-color: #606266;
    		}
    	}
    	.dm-pop {
    		img {
    			vertical-align: top;
    			height: 124px;
    		}
    	}
    }
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
    			background: none;
    			.el-loading-spinner .path {
    				stroke: #ff8800;
    			}
    		}
    		.dm-code-img-wrap {
    			cursor: pointer;
    			height: 40px;
    			margin: 0 70px;
    			img {
    				height: 100%;
    			}
    		}
    	}
    	.el-dialog {
    		border-radius: 18px;
    		background: #363636;
    		max-width: 1700px;
    		width: 72%;
    		min-width: 1000px;
    		// height: 80%;
    		min-height: 750px;
    		margin-top: 13vh !important;
    		.el-card {
    			background: none;
    			border: none;
    		}
    		.el-dialog__body {
    			display: flex;
    			justify-content: space-around;
    			align-items: center;
    		}
    		.right {
    			width: 600px;
    		}
    		.msg {
    			background: rgba(255, 255, 255, 0.03);
    			color: #dbdbdb;
    			margin-top: 30px;
    			height: 140px;
    			position: relative;
    			.title {
    				color: #888;
    			}
    			span {
    				padding: 0 30px 0 0;
    				line-height: 36px;
    			}
    			.dm-code-img {
    				position: absolute;
    				right: 40px;
    				top: 0;
    				bottom: 0;
    				margin: auto;
    				width: 80px;
    				height: 80px;
    			}
    		}
    		.result {
    			height: 600px;
    			p {
    				position: absolute;
    				line-height: 600px;
    				width: 100%;
    				text-align: center;
    				color: #555;
    				font-size: 17px;
    				z-index: 0;
    			}
    			.img {
    				position: relative;
    				z-index: 1;
    			}
    		}
    		.el-dialog__close {
    			font-size: 24px;
    		}
    		.el-dialog__headerbtn:focus .el-dialog__close,
    		.el-dialog__headerbtn:hover .el-dialog__close {
    			color: #ff8800;
    		}
    		.magnifier {
    			width: 430px;
    			height: 860px;
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
    	.pager {
    		margin: 30px 0;
    		text-align: right;
    		.el-input__inner {
    			background: rgba($color: #fff, $alpha: 0.1);
    			border: none;
    			color: #dbdbdb;
    		}
    	}
    	.el-pagination.is-background .el-pager li:not(.disabled).active {
    		background: rgba($color: #fff, $alpha: 0.1);
    		color: #ff8800;
    		box-shadow: 0 0 0 1px #ff8800;
    	}
    	.el-pagination.is-background .el-pager li:not(.disabled):hover {
    		color: #ff8800;
    	}
    	.el-pagination.is-background .btn-next,
    	.el-pagination.is-background .btn-prev,
    	.el-pagination.is-background .el-pager li {
    		color: #dbdbdb;
    		background: rgba($color: #fff, $alpha: 0.1);
    	}
    	.el-pagination.is-background .btn-next.disabled,
    	.el-pagination.is-background .btn-next:disabled,
    	.el-pagination.is-background .btn-prev.disabled,
    	.el-pagination.is-background .btn-prev:disabled,
    	.el-pagination.is-background .el-pager li.disabled {
    		color: #777;
    	}
    	.el-button--text:focus,
    	.el-button--text:hover {
    		color: #ff8800;
    	}
    	.el-button--text {
    		color: #dbdbdb;
    	}
    }
    @media screen and (max-width: 1920px) {
    	.history-list {
    		width: 1420px;
    		.el-dialog {
    			.magnifier {
    				width: 325px;
    				height: 650px;
    			}
    			.right {
    				width: 500px;
    				.result {
    					height: 500px;
    					p {
    						line-height: 500px;
    					}
    				}
    				.msg {
    					height: 120px;
    				}
    			}
    		}
    	}
    }
</style>