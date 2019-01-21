<template>
    <div class="design-list">
        <div class="search">
            <div class="search-left"></div>
            <right-nav ref="rightNav" :handleDownload='handleDownload' :exportOption='exportOption' :onFileAdd='onFileAdd' :workflowList='workflowList'></right-nav>
        </div>
        <el-table v-if='innerHeight' ref="multipleTable" stripe :data="workflowList" @row-contextmenu="contextmenuHandle" v-loading="loading" :height="innerHeight" @selection-change="handleSelectionChange">
            <div slot="empty">
                <p v-if='!loading && editorLoaded.state() === "resolved"'>
                    <img class="no-data" src="~asset/images/no-data.png">
                </p>
            </div>
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column type="index">
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
                    <span v-text="$dateFns.format(scope.row.cts,'YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="最后修改时间" width="180">
                <template slot-scope="scope">
                    <span v-text="$dateFns.format(scope.row.ts,'YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="运行状态">
                <template slot-scope="scope">
                    <el-switch @change="activeChange(scope.row,$event)" :disabled="scope.row.flowData.disabled" v-model="scope.row.active"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="370">
                <template slot-scope="scope">
                    <div class="opration">
                        <div class="top-btn">
                            <el-button title="runtime" type="primary" @click="jumperHandle(scope.row)">
                                <v-icon name='wailian'></v-icon> runtime
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
        <upload-dialog :uploadOption='uploadOption' :uploadCancel='uploadCancel' :uploadDesignList='uploadDesignList'></upload-dialog>
        <context-menu v-show='active' ref="contextMenu" :handleCopy='handleCopy' :handleDelete='handleDelete' :handleDownload='handleDownload' :active='active'></context-menu>
    </div>
</template>
<script type="babel">
    import { export2Json } from '@/vendor/Export2Json'
    import rightNav from './rightNav'
    import uploadDialog from './uploadDialog'
    import contextMenu from './contextmenu'
    import FlowDisplayer from 'component/ModelFlowEditor/displayer'
    import { SET_WORKFLOW_LIST } from '../../../store/app/mutation-type'
    import _ from 'lodash';
    export default {
        data() {
            return {
                innerHeight: 0,
                active: null,
                total: 30,
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
                // 请求时的loading效果
                loading: false
            }
        },
        props: ['editorLoaded'],
        components: {
            FlowDisplayer,
            contextMenu,
            uploadDialog,
            rightNav
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
                let resp = null;
                try {
                    if (statu) {
                        resp = await this.$request.task.postTask(item);
                    } else {
                        resp = await this.$request.task.deleteTask(item._id);
                    }
                    Object.assign(item, resp.data);
                } catch (error) {
                    if (statu) {
                        item.task_id = '';
                        item.active = false;
                    }
                    throw error;
                } finally {
                    loading.close();
                }
            },
            gotoWatch(item) {
                // 跳转到查看work-flow的displayer
                this.$router.push({ name: '新建流程', params: { _id: item._id, flow: item, read: true } });
            },
            jumperHandle(flow) {
                window.open(`/?workflowid=${flow._id}`);
            },
            contextmenuHandle(row, e) {
                this.active = row;
                this.$nextTick(() => {
                    const contextMenu = this.$refs.contextMenu.$el;
                    $(contextMenu).css({ top: e.clientY, left: e.clientX })
                })
                e.stopPropagation();
                e.preventDefault();
            },
            handleSelectionChange(val) {
                this.exportOption.multipleSelection = val;
            },
            uploadCancel() {
                this.$refs.rightNav.formReset();
                this.uploadOption.reset();
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
                        r.ts = new Date().getTime();
                        await this.creatWorkflow(r);
                    })
                    await Promise.all(promises);
                    this.uploadCancel();
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
                export2Json(list);
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
                    const resp = await this.$request.workflow.deleteWorkflow(item._id);
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
                let newItem = _.cloneDeep(item);
                const { flowData, layout, output, name } = newItem;
                newItem = { flowData, layout, output, active: false, ts: new Date().getTime(), cts: new Date().getTime() }
                this.$prompt('请输入新克隆的流程名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: `${name}_copy_${new Date().getTime()}`
                }).then(async ({ value }) => {
                    newItem.name = value;
                    await this.creatWorkflow(newItem);
                    this.$message({
                        type: 'success',
                        message: `克隆流程 ${value} 成功！`
                    });
                })
            },
            async getDesignList() {
                await this.editorLoaded;
                if (EASY_ENV_IS_BROWSER) {
                    this.loading = true;
                }
                try {
                    await this.$store.dispatch(SET_WORKFLOW_LIST)
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
            getInnerHeight() {
                if (EASY_ENV_IS_BROWSER) {
                    this.innerHeight = this.$el.clientHeight - 70;
                }
            },
            emitWorkflow() {
                window.ws.on('workflow', data => {
                    const { type, msg } = data;
                    if (type === 'update') {
                        const item = this.workflowList.find(i => i._id === msg._id);
                        if (item) {
                            Object.assign(item, msg);
                        }
                        return;
                    }
                    if (type === 'add') {
                        this.workflowList.unshift(msg);
                        return;
                    }
                    if (type === 'delete') {
                        const index = this.workflowList.findIndex(i => i._id === msg._id);
                        if (index !== -1) {
                            this.workflowList.splice(index, 1);
                        }
                    }
                })
            }
        },
        computed: {
            algorithmModuleList() {
                return this.$store.getters.algorithmModuleList;
            },
            workflowList() {
                return this.$store.state.workflowList;
            }
        },
        mounted() {
            this.getInnerHeight();
            $(window).on('resize.record', this.getInnerHeight)

            this.$nextTick(() => {
                if (window.ws.connected) {
                    this.emitWorkflow()
                } else {
                    window.ws.on('connect', () => {
                        this.emitWorkflow()
                    })
                }
            })
        },
        beforeMount() {
            if (this.algorithmModuleList.length) {
                this.getDesignList()
            }
            $(window).on('click.workflowList contextmenu.workflowList', () => {
                this.active = null;
            });
        },
        beforeDestroy() {
            $(window).off('click.workflowList contextmenu.workflowList resize.record');
        },
        watch: {
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
        .el-table {
            height: 890px;
            .cell .red {
                color: #f44336;
            }
            .cell .opration {
                .top-btn {
                    display: flex;
                    align-items: center;
                    display: table;
                    white-space: nowrap;
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