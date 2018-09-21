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
            <el-date-picker v-model="q.dateRange" type="datetimerange" :picker-options="pickerOptions" start-placeholder="开始时间" end-placeholder="结束时间" align="left">
            </el-date-picker>
            <el-button class="search-button" type="text" @click="query()">查询</el-button>
            <!-- <el-button class="add-button" type="success" @click="write()">写文章</el-button> -->
        </div>
        <el-table stripe :data="articleList" v-loading="loading" element-loading-text="拼命加载中" height="650">
            <el-table-column type="index" width="55" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="title" label="二维码ID" width="355">
            </el-table-column>
            <el-table-column prop="hits" label="OK/NG">
            </el-table-column>
            <el-table-column prop="status" label="缺陷类型">
                <template slot-scope="props">
                    <span v-text="props.row.status == 1 ? '已发布' : '草稿'"></span>
                </template>
            </el-table-column>
            <el-table-column prop="hits" label="时间">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="props">
                    <!-- <router-link :to="{params: {id: props.row.id}}" tag="span">
                        <el-button type="info" size="small" icon="edit" @click="handleEdit(props.$index, props.row)">修改</el-button>
                    </router-link>
                    <el-button type="danger" size="small" icon="delete" @click="handleDelete(props.$index, props.row)">删除</el-button> -->
                    <el-button type="text" icon="delete" @click="handleDelete(props.$index, props.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background class="pager" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="q.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="q.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>
<script type="babel">
    import { SET_ARTICLE_LIST, DELETE_ARTICLE } from "../store/app/mutation-type"
    export default {
      components: {},
      data() {
        return {
          pickerOptions: {
            shortcuts: [
              {
                text: "最近一周",
                onClick(picker) {
                  const end = new Date()
                  const start = new Date()
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                  picker.$emit("pick", [start, end])
                }
              },
              {
                text: "最近一个月",
                onClick(picker) {
                  const end = new Date()
                  const start = new Date()
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                  picker.$emit("pick", [start, end])
                }
              },
              {
                text: "最近三个月",
                onClick(picker) {
                  const end = new Date()
                  const start = new Date()
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
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
            dateRange: ""
          },
          //请求时的loading效果
          loading: false
        }
      },
      methods: {
        indexMethod(index) {
          return (this.q.pageIndex - 1) * this.q.pageSize + index + 1
        },
        fetchApi(store, json) {
          return store.dispatch(SET_ARTICLE_LIST, json)
        },
        query() {
          this.fetchApi(this.$store, this.q)
        },
        write() {
          this.$router.push("/article/add")
        },
        handleSelectionChange(val) {
          console.log("handleSelectionChange", val)
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`)
          this.q.pageSize = val
          this.fetchApi(this.$store, this.q)
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`)
          this.q.pageIndex = val
          this.fetchApi(this.$store, this.q)
        },
        handleEdit(index, row) {
          this.$message(`你点击了编辑操作 index:${index}, id:${row.id}`)
        },
        handleDelete(index, row) {
          this.$store.dispatch(DELETE_ARTICLE, { id: row.id })
          this.$message(`删除[${row.title}]成功!`)
        }
      },
      computed: {
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
      }
    }
</script>
<style lang="scss">
    .history-list {
      width: 1900px;
      min-height: 600px;
      padding: 30px 0 0;
      margin: 0 auto;
      .el-table {
        margin-top: 30px;
        min-height: 650px;
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

      .el-table thead,
      .el-table tbody {
        color: #dbdbdb;
      }
      .el-table,
      .el-table__expanded-cell {
        background: none;
        border-radius: 18px;
      }
      .el-table th {
        background: rgba($color: #ff8800, $alpha: 0.3);
      }
      .el-table tr {
        background-color: rgba(255, 255, 255, 0.06);
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: none;
        &:nth-child(1) {
          border-left: 1px solid #ff8800;
        }
        &:last-child {
          border-right: 1px solid #ff8800;
        }
      }
      .el-table--enable-row-hover .el-table__body tr:hover {
        box-shadow: 0 0 0 1px #ff8800;
      }
      .el-table--border::after,
      .el-table--group::after,
      .el-table::before {
        background: none;
      }
      .el-table td {
        padding: 4px 0;
      }
      .el-button--text:focus,
      .el-button--text:hover {
        color: #ff8800;
      }
      .el-button--text {
        color: #dbdbdb;
      }
      .el-table--border,
      .el-table--group,
      .el-table td,
      .el-table th.is-leaf {
        border: none;
      }
      .el-table tr {
        box-sizing: border-box;
      }
      .el-table--striped .el-table__body tr.el-table__row--striped td {
        background: rgba(255, 255, 255, 0.09);
      }
    }
    @media screen and (max-width: 1920px) {
      .history-list {
        width: 1420px;
      }
    }
</style>