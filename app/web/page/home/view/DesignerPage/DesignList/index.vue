<template>
    <div class="design-list">
        <div class="search">
            <div class="search-left">
                <!-- <el-date-picker v-model="q.dateRange" type="datetimerange" :picker-options="pickerOptions" start-placeholder="开始时间" end-placeholder="结束时间" align="left" value-format="timestamp">
                </el-date-picker>
                <el-button class="search-button" type="text" @click="q.pageIndex = 1;getDesignList()">查询</el-button> -->
            </div>
            <div class="search-right">
                <div class="export-wrap">
                    <el-button type="text" @click='handleDownload(exportOption.checkedMode?exportOption.multipleSelection:designList)'><i class="el-icon-download"></i> 导出</el-button>
                    <el-select v-model="exportOption.checkedMode" class="export-mode">
                        <el-option v-for="item in exportOption.options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </div>
                <form ref="optionForm" class="option-form">
                    <input type="file" accept="application/json" ref='option' @change="onFileAdd" v-show="false">
                    <el-button type="text" @click="$refs.option.click()"><i class="el-icon-upload2"></i> 导入流程</el-button>
                </form>
                <router-link to='/design/designer/0'>
                    <el-button class="search-button" type="text"><i class="el-icon-circle-plus-outline"></i> 新建流程</el-button>
                </router-link>
            </div>
        </div>
        <el-table v-if='innerHeight' ref="multipleTable" stripe :data="designList" @row-contextmenu="contextmenuHandle" v-loading="loading" :height="innerHeight" @selection-change="handleSelectionChange">
            <div slot="empty">
                <p v-if='!loading'>No Content</p>
            </div>
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="_id" label="ID">
            </el-table-column>
            <el-table-column prop="name" label="流程名称">
            </el-table-column>
            <el-table-column label="概览" width="230">
                <template slot-scope="scope">
                    <flow-displayer :flowData='scope.row.flowData' class="flow-wrap"></flow-displayer>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="180">
                <template slot-scope="scope">
                    <span v-text="$moment(scope.row.cts).format('YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="最后修改时间" width="180">
                <template slot-scope="scope">
                    <span v-text="$moment(scope.row.ts).format('YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="运行状态">
                <template slot-scope="scope">
                    <el-switch @change="activeChange(scope.row,$event)" :disabled="scope.row.flowData.disabled" v-model="scope.row.active"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <div class="opration">
                        <div class="top-btn">
                            <el-button v-if='scope.row.active' title="外链" type="primary" @click="jumperHandle(scope.row.task_id)">
                                <v-icon name='wailian'></v-icon>
                            </el-button>
                            <router-link :to="{name: '新建流程',params: {_id:scope.row._id,flow: scope.row}}">
                                <el-button title='修改' type="warning">
                                    <v-icon name='xiugaitupian'></v-icon> 修改
                                </el-button>
                            </router-link>
                            <el-button title="查看" type="info" @click="gotoWatch(scope.row)">
                                <v-icon name='065chakandingdan'></v-icon> 查看
                            </el-button>
                            <el-button title="更多按钮" type="text" @click="contextmenuHandle(scope.row,$event)">
                                <v-icon name='gengduoanniu'></v-icon>
                            </el-button>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- <el-pagination background class="pager" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="q.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="q.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination> -->
        <el-dialog title="上传流程" :visible.sync="uploadOption.showPop" custom-class="upload-pop-dialog">
            <el-checkbox :indeterminate="uploadOption.isIndeterminate" v-model="uploadOption.checkAll" :disabled="uploadOption.checkAllDisabled" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin-bottom:20px"></div>
            <el-checkbox-group v-model="uploadOption.checkedList" @change="handleCheckedChange">
                <el-checkbox v-for="item in uploadOption.uploadList" :label="item._id" :key="item._id" :disabled="item.disabled">{{item.name}}{{item.disabled?'(不可用)':''}}</el-checkbox>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="uploadDesignList(uploadOption)">上传</el-button>
                <el-button @click="uploadCancel">取消</el-button>
            </div>
        </el-dialog>
        <div class="context-menu" v-if='active' ref="contextMenu" @contextmenu.stop.prevent>
            <el-button type="text" @click="handleCopy(active)">
                <v-icon name='s-clonekelong'></v-icon> 克隆
            </el-button>
            <el-button type="text" @click="handleDelete(active)">
                <v-icon name='shanchu'></v-icon> 删除
            </el-button>
            <el-button type="text" @click='handleDownload([active])'>
                <v-icon name='xiazai'></v-icon> 导出
            </el-button>
        </div>
    </div>
</template>
<script type="babel">
    import FlowDisplayer from 'component/ModelFlowEditor/displayer'
    export default {
        data() {
            return {
                innerHeight: 0,
                active: null,
                total: 30,
                designList: [],
                exportOption: {
                    multipleSelection: [],
                    checkedMode: 0,
                    options: [{
                        value: 0,
                        label: '全部',
                        disabled: false
                    }, {
                        value: 1,
                        label: '选中',
                        disabled: false
                    }]
                },
                uploadOption: {
                    checkAllDisabled: false,
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
                        this.checkAllDisabled = false;
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
        props: ['editorLoaded'],
        components: {
            FlowDisplayer
        },
        methods: {
            loadingUi() {
                return this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            },
            async activeChange(item, statu) {
                // task开关
                const loading = this.loadingUi();
                try {
                    if (statu) {
                        await this.creatTask(item);
                    } else {
                        await this.deleteTask(item);
                    }
                    await this.$request.workflow.patchWorkflow(item._id, item);
                } catch (error) {
                    throw error;
                } finally {
                    loading.close();
                }
            },
            async creatTask(item) {
                // 创建task
                try {
                    // 获取一个任务id
                    const task = await this.$request.task.getTaskId();
                    const taskId = task.data;
                    if (taskId) {
                        const creatTask = await this.$request.task.postTask({
                            task_id: taskId,
                            workflow_id: item._id
                        });
                        if (creatTask.data.indexOf('error') != -1) {
                            item.task_id = '';
                            item.active = false;
                            this.$message({
                                message: `开启任务失败! ${creatTask.data}`,
                                type: 'error'
                            })
                            return;
                        }
                        item.task_id = taskId;
                    }
                } catch (error) {
                    item.active = false;
                }
            },
            async deleteTask(item) {
                // 删除task
                try {
                    const deleteTask = await this.$request.task.deleteTask(item.task_id);
                    item.task_id = '';
                } catch (error) {
                    item.active = true;
                }
            },
            gotoWatch(item) {
                // 跳转到查看work-flow的displayer
                this.$router.push({ name: '新建流程', params: { _id: item._id, flow: item, read: true } });
            },
            jumperHandle(taskId) {
                window.open(`/?id=${taskId}`);
            },
            contextmenuHandle(row, e) {
                this.active = row;
                this.$nextTick(() => {
                    const contextMenu = this.$refs.contextMenu;
                    $(contextMenu).css({ top: e.clientY, left: e.clientX })
                })
                e.stopPropagation();
                e.preventDefault();
            },
            handleSelectionChange(val) {
                this.exportOption.multipleSelection = val;
            },
            uploadCancel() {
                this.$refs.optionForm.reset();
                this.uploadOption.reset();
            },
            handleCheckAllChange(val) {
                this.uploadOption.checkedList = val ? this.uploadOption.uploadList.map(li => li._id) : [];
                this.uploadOption.isIndeterminate = false;
            },
            handleCheckedChange(value) {
                const checkedCount = value.length;
                const uploadCount = this.uploadOption.uploadList.length;
                this.uploadOption.checkAll = checkedCount === uploadCount;
                this.uploadOption.isIndeterminate = checkedCount > 0 && checkedCount < uploadCount;
            },
            onFileAdd(e) {
                // input的file change事件
                const files = e.target.files || e.dataTransfer.files;
                if (!files.length) { return; }
                this.createDesign(files[0]);
            },
            async uploadDesignList(list) {
                const addList = list.uploadList.filter(li => list.checkedList.includes(li._id));
                if (!addList.length) {
                    this.$message({
                        message: '没有可上传的流程',
                        type: 'warning'
                    })
                    return;
                }
                const loading = this.loadingUi();
                try {
                    const promises = addList.map(async r => {
                        r.ts = this.$moment().format();
                        await this.creatWorkflow(r);
                    })
                    await Promise.all(promises);
                    this.uploadCancel();
                    await this.getDesignList();
                } catch (error) {
                    throw error;
                } finally {
                    loading.close();
                }
            },
            createDesign(file) {
                // 创建可添加的流程（过滤和判断是不是可用）
                const reader = new FileReader();
                const self = this;
                reader.onload = (e) => {
                    const result = JSON.parse(e.target.result)
                    result.forEach(r => {
                        const notPass = r.flowData.nodes.some(node => !this.algorithmModuleList.includes(node.shape));
                        // r.disabled = notPass;
                        r.active = false;
                        r.flowData.disabled = notPass;
                        if (notPass && this.uploadOption.checkAll) {
                            // this.uploadOption.checkAllDisabled = true;
                            // this.uploadOption.checkAll = false;
                        }
                    })
                    this.uploadOption.uploadList = result;
                    this.uploadOption.checkedList = this.uploadOption.uploadList.filter(li => !li.disabled).map(li => li._id);
                    this.uploadOption.showPop = true;
                };
                reader.readAsText(file);
            },
            handleDownload(list) {
                // 导出work-flow的json文件
                if (!list.length) {
                    this.$message({
                        message: '当前没有流程可导出',
                        type: 'warning'
                    })
                    return;
                }
                list.forEach(li => {
                    delete li._id;
                    delete li.task_id;
                    li.active = false;
                });
                import('file-saver').then(FileSaver => {
                    const blob = new Blob([JSON.stringify(list)], { type: 'text/plain;charset=utf-8' });
                    FileSaver.saveAs(blob, `design${this.$moment().format('YYYYMMDDHHmmss')}.json`);
                })
            },
            handleDelete(item) {
                let msg = '此操作将删除该流程, 是否继续?';
                if (item.active) {
                    msg = '*任务正在运行,此操作将关闭任务*，' + msg;
                }
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.deleteWorkflow(item);
                })
            },
            async creatWorkflow(item) {
                try {
                    const resp = await this.$request.workflow.postWorkflow(item);
                } catch (error) {
                    this.$message({
                        type: 'error',
                        message: '创建流程失败！'
                    })
                    throw error;
                }
            },
            async deleteWorkflow(item) {
                const loading = this.loadingUi();
                try {
                    if (item.active) {
                        await this.deleteTask(item);
                    }
                    const resp = await this.$request.workflow.deleteWorkflow(item._id);
                    await this.getDesignList();
                } catch (error) {
                    this.$message({
                        type: 'error',
                        message: '删除流程失败！'
                    })
                } finally {
                    loading.close();
                }
            },
            async handleCopy(item) {
                const newItem = _.cloneDeep(item);
                newItem.active = false;
                newItem.ts = this.$moment().format();
                newItem.cts = this.$moment().format();
                delete newItem._id;
                delete newItem.task_id;
                this.$prompt('请输入新克隆的流程名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: `${newItem.name}_copy_${this.$moment().valueOf()}`
                }).then(async ({ value }) => {
                    newItem.name = value;
                    await this.creatWorkflow(newItem);
                    await this.getDesignList();
                    this.$message({
                        type: 'success',
                        message: `克隆流程 ${value} 成功！`
                    });
                })
            },
            indexMethod(index) {
                return (this.q.pageIndex - 1) * this.q.pageSize + index + 1
            },
            async getDesignList() {
                await this.editorLoaded;
                if (EASY_ENV_IS_BROWSER) {
                    this.loading = true;
                }
                try {
                    let designList,
                        tasks;
                    const p1 = this.$request.workflow.getWorkflows().then(resp => designList = resp.data);
                    const p2 = this.$request.task.getTasks().then(resp => tasks = resp.data);
                    await Promise.all([p1, p2]);

                    const promises = designList.map(async d => {
                        // 异常
                        if (!d.flowData) {
                            d.flowData = { disabled: true };
                            return
                        }
                        d.flowData.disabled = false;
                        d.flowData.nodes.forEach(n => {
                            if (!this.algorithmModuleList.includes(n.shape)) {
                                n.shape = n.shape + '_delete'
                                if (!d.flowData.disabled) {
                                    d.flowData.disabled = true;
                                }
                            }
                        })
                        if (d.task_id) {
                            if (!tasks.includes(d.task_id)) {
                                d.task_id = '';
                                d.active = false;
                                await this.$request.workflow.patchWorkflow(d._id, d);
                            }
                        }
                    })
                    await Promise.all(promises);
                    this.designList = designList.sort((a, b) => this.$moment(b.ts).valueOf() - this.$moment(a.ts).valueOf());
                } catch (error) {
                    this.$message({
                        type: 'error',
                        message: '获取流程列表失败！'
                    })
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            handleSizeChange(val) {
                this.q.pageSize = val
                this.getDesignList()
            },
            handleCurrentChange(val) {
                this.q.pageIndex = val
                this.getDesignList()
            },
            getInnerHeight() {
                if (EASY_ENV_IS_BROWSER) {
                    this.innerHeight = this.$el.clientHeight - 70;
                }
            }
        },
        computed: {
            algorithmModuleList() {
                return this.$store.getters.algorithmModuleList;
            }
        },
        mounted() {
            this.getInnerHeight();
            $(window).on('resize.record', this.getInnerHeight)
        },
        beforeMount() {
            if (this.algorithmModuleList.length) {
                this.getDesignList()
            }
            $(window).on('click.designList contextmenu.designList', () => {
                this.active = null;
            });
        },
        beforeDestroy() {
            $(window).off('click.designList contextmenu.designList resize.record');
        },
        watch: {
            'q.dateRange': function(r) {
                if (r === null) {
                    this.q.pageIndex = 1
                    this.getDesignList()
                }
            },
            '$route.query': function(q) {
                if (q.reload) {
                    this.getDesignList()
                }
            },
            algorithmModuleList(arr, oldArr) {
                if (arr.toString() === oldArr.toString()) return;
                this.getDesignList()
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
        .context-menu {
            position: fixed;
            top: 0;
            left: 0;
            width: auto;
            z-index: 10;
            display: flex;
            flex-direction: column;
            background: #444;
            border-radius: 5px;
            padding: 5px 0;
            box-shadow: 1px 0 5px 0 rgba($color: #000, $alpha: 0.8);
            .el-button--text {
                cursor: pointer;
                margin: 0;
                padding: 10px 15px;
            }
        }
        .el-table {
            height: 890px;
            .cell .red {
                color: #f44336;
            }
            .cell .opration {
                width: 330px;
                margin: 0 auto;
                .top-btn {
                    display: flex;
                    align-items: center;
                    display: table;
                    margin: 0 auto;
                    .el-button {
                        font-weight: normal;
                        line-height: 18px;
                        padding: 6px 12px;
                    }
                    > * {
                        margin: 0;
                        margin-right: 15px;
                    }
                }
            }
            .cell .flow-wrap {
                width: 210px;
                height: 140px;
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
            .export-mode {
                .el-input__inner {
                    padding: 0 8px;
                    width: 50px;
                }
                .el-select__caret {
                    display: none;
                }
            }
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
                color: #dbdbdb;
                border: none;
                background: rgba($color: #fff, $alpha: 0.1);
            }
            .el-date-editor .el-range-separator {
                color: #aaa;
            }
            .export-wrap {
                display: flex;
                align-items: center;
            }
            .option-form {
                margin: 0 30px;
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