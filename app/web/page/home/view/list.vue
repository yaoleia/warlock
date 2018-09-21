<template>
    <div class="history-list">
        <div class="search">
            <el-row class="clear">
                <label> 标题:</label>
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
                </el-select>
                <el-button class="search-button" type="primary" @click="query()">查询</el-button>
                <el-button class="add-button" type="success" @click="write()">写文章</el-button>
            </el-row>
        </div>
        <el-table stripe :data="articleList" v-loading="loading" element-loading-text="拼命加载中" border style="width: 100%;">
            <el-table-column type="index" width="55" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="title" label="二维码ID">
                <template slot-scope="props">
                    <router-link :to="'/article/detail/'+ props.row.id">{{props.row.title}}</router-link>
                </template>
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
            <!-- <el-table-column label="操作" width="180">
                <template slot-scope="props">
                    <router-link :to="{params: {id: props.row.id}}" tag="span">
                        <el-button type="info" size="small" icon="edit" @click="handleEdit(props.$index, props.row)">修改</el-button>
                    </router-link>
                    <el-button type="danger" size="small" icon="delete" @click="handleDelete(props.$index, props.row)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <el-pagination class="pager" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="q.pageIndex" :page-sizes="[10, 15, 20, 50]" :page-size="q.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>
<style lang="scss">
    .history-list {
      width: 1900px;
      min-height: 600px;
      padding: 30px 0 0;
      margin: 0 auto;
      .el-table {
        margin-top: 30px;
        min-height: 500px;
      }
      .pager {
        display: table;
        margin: 30px auto;
      }
      .el-table,
      .el-table__expanded-cell {
        background: none;
      }
      .el-table th,
      .el-table tr {
        background-color: rgba(255, 255, 255, 0.06);
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: none;
      }
      .el-table tr {
        box-sizing: border-box;
        border: 1px solid #ff8800;
        cursor: pointer;
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
<script type="babel">
    import { SET_ARTICLE_LIST, DELETE_ARTICLE } from "../store/app/mutation-type"
    export default {
      components: {},
      data() {
        return {
          q: {
            title: undefined,
            categoryId: undefined,
            statusId: undefined,
            pageIndex: 1,
            pageSize: 10
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