<template>
    <div class="design-list">
        <div class="search">
            <div class="search-left">
                <el-date-picker v-model="q.dateRange" type="datetimerange" :picker-options="pickerOptions" start-placeholder="开始时间" end-placeholder="结束时间" align="left" value-format="timestamp">
                </el-date-picker>
                <el-button class="search-button" type="text" @click="q.pageIndex = 1;query()">查询</el-button>
            </div>
            <div class="search-right">
                <router-link to='/design/designer/0'>
                    <el-button class="search-button" type="text"><i class="el-icon-circle-plus-outline"></i> 新建流程</el-button>
                </router-link>
                <el-button type="text" class="all-export" @click='handleDownload(designList)'><i class="el-icon-download"></i> 导出全部</el-button>
                <form ref="optionForm">
                    <input type="file" ref='option' @change="onFileAdd" v-show="false">
                    <el-button type="text" @click="$refs.option.click()"><i class="el-icon-upload2"></i> 导入流程</el-button>
                </form>
            </div>
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
            <el-table-column label="创建时间" width="200">
                <template slot-scope="scope">
                    <span v-text="$moment().format('YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="最后修改时间" width="200">
                <template slot-scope="scope">
                    <span v-text="$moment().format('YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="340">
                <template slot-scope="scope">
                    <div class="opration">
                        <router-link :to="{name: '新建流程',params: {id:scope.row.id,flow: scope.row}}">
                            <el-button type="warning" size='mini'>修改</el-button>
                        </router-link>
                        <router-link :to="{name: '新建流程',params: {id:scope.row.id,flow: scope.row, read: true}}">
                            <el-button type="primary" size='mini'>查看</el-button>
                        </router-link>
                        <el-button type="danger" size='mini' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button type="info" size='mini' @click='handleDownload([scope.row])'>导出</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background class="pager" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="q.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="q.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <el-dialog title="上传流程" :visible.sync="upload.showPop" custom-class="upload-pop-dialog">
            <el-checkbox :indeterminate="upload.isIndeterminate" v-model="upload.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="upload.checkedList" @change="handleCheckedChange">
                <el-checkbox v-for="item in upload.uploadList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="uploadDesignList(upload)">上传</el-button>
                <el-button @click="uploadCancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="babel">
    import FlowDisplayer from 'component/ModelFlowEditor/displayer'
    export default {
        data() {
            return {
                total: 30,
                designList: [],
                upload: {
                    showPop: false,
                    isIndeterminate: false,
                    checkAll: true,
                    checkedList: [],
                    uploadList: [],
                    reset() {
                        this.showPop = false;
                        this.isIndeterminate = false;
                        this.checkAll = true;
                        this.checkedList = [];
                        this.uploadList = [];
                    }
                },
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
            uploadCancel() {
                this.$refs.optionForm.reset();
                this.upload.reset();
            },
            handleCheckAllChange(val) {
                this.upload.checkedList = val ? this.upload.uploadList.map(li => li.id) : [];
                this.upload.isIndeterminate = false;
            },
            handleCheckedChange(value) {
                const checkedCount = value.length;
                const uploadCount = this.upload.uploadList.length;
                this.upload.checkAll = checkedCount === uploadCount;
                this.upload.isIndeterminate = checkedCount > 0 && checkedCount < uploadCount;
            },
            onFileAdd(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (!files.length) { return; }
                this.createDesign(files[0]);
            },
            uploadDesignList(list) {
                list.uploadList = list.uploadList.filter(li => list.checkedList.includes(li.id));
                list.uploadList.forEach(r => {
                    const li = this.designList.find(d => d.id === r.id)
                    if (!li) {
                        this.designList.push(r)
                    } else {
                        Object.assign(li, r)
                    }
                    this.uploadCancel();
                    this.designList.sort((a, b) => b.ts - a.ts);
                })
            },
            createDesign(file) {
                const reader = new FileReader();
                const self = this;
                reader.onload = (e) => {
                    this.upload.uploadList = JSON.parse(e.target.result);
                    this.upload.checkedList = this.upload.uploadList.map(li => li.id);
                    this.upload.showPop = true;
                };
                reader.readAsText(file);
            },
            handleDownload(list) {
                if (!list.length) {
                    this.$message({
                        message: '当前没有流程可导出',
                        type: 'warning'
                    })
                    return;
                }
                import('file-saver').then(FileSaver => {
                    const blob = new Blob([JSON.stringify(list)], { type: 'text/plain;charset=utf-8' });
                    FileSaver.saveAs(blob, `design${this.$moment().format('YYYYMMDDHHmmss')}.json`);
                })
            },
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
        .upload-pop-dialog {
            width: 500px;
        }
        .el-table {
            height: 890px;
            .cell .red {
                color: #f44336;
            }
            .cell .opration {
                text-align: center;
                > * {
                    display: inline-block;
                    margin: 0 4px;
                }
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
            display: flex;
            justify-content: space-between;
            .search-right {
                display: flex;
            }
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
            .all-export {
                margin: 0 20px;
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