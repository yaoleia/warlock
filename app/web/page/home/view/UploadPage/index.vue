<template>
    <div class="upload-page">
        <div class="top-wrap">
            <el-upload class="uploader" accept=".qz,.zip" :on-progress='onProgress' :show-file-list='false' drag :action="$request.plugin.postPluginAction(serverUrl)" name='file' multiple :on-success='setAlgorithm' :before-upload="beforeAvatarUpload" :on-error='uploadError' :with-credentials='true' :headers="{'x-csrf-token':csrf}">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <el-input v-model="search" size="small" clearable placeholder="输入module/type/super_type关键字搜索" />
        </div>
        <div class="progress-model" v-show="showProgess">
            <div class="progress-wrap">
                <el-progress type="circle" :percentage="progress.percent" :status="progress.status"></el-progress>
                <p>{{progress.name}}</p>
            </div>
        </div>
        <el-table ref="multipleTable" stripe :data="pluginListFilter" v-loading="loading" v-if="innerHeight" :height="innerHeight">
            <div slot="empty">
                <p v-if='!loading'>No Content</p>
            </div>
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="初始化参数">
                            <span>{{ props.row.init_params }}</span>
                        </el-form-item>
                        <el-form-item label="输入参数">
                            <span>{{ props.row.exec_params }}</span>
                        </el-form-item>
                        <el-form-item label="输出参数">
                            <span>{{ props.row.exec_outputs }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="module" label="module">
            </el-table-column>
            <el-table-column prop="type" label="type">
            </el-table-column>
            <el-table-column prop="super_type" label="super_type">
            </el-table-column>
            <el-table-column prop="version" label="version">
            </el-table-column>
            <el-table-column prop="author" label="author">
            </el-table-column>
            <el-table-column prop="create_time" label="create_time">
            </el-table-column>
            <el-table-column label="操作" width="340">
                <template slot-scope="scope">
                    <div class="opration">
                        <div class="top-btn">
                            <el-button v-if='!scope.row.open' title="展开" type="text" @click.native="handleExpand(scope.row)">
                                展开
                            </el-button>
                            <el-button v-else title="收起" type="text" @click.native="handleExpand(scope.row)">
                                收起
                            </el-button>
                            <el-button title="删除" type="text" @click.native="handleDelete(scope.row)">
                                删除
                            </el-button>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style lang="scss">
    .upload-page {
        position: relative;
        .uploader {
            .el-upload-dragger {
                width: 250px;
                height: 130px;
                .el-icon-upload {
                    margin: 20px 0 16px;
                }
            }
        }

        .el-table {
            .demo-table-expand {
                display: flex;
                justify-content: space-between;
                > .el-form-item {
                    padding: 0 10px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            }
            table.el-table__body {
                td.el-table__expanded-cell {
                    background: #222 !important;
                    border-radius: 0 !important;
                }
            }
            .el-table__expand-icon,
            .el-table__expand-icon--expanded {
                font-weight: bolder;
            }
            .el-table__expand-icon--expanded {
                color: #ff8800;
            }
            .top-btn {
                *:hover {
                    color: #ff8800;
                }
            }
        }
        .progress-model {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
            background: rgba($color: #000000, $alpha: 0.7);
            .progress-wrap {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                width: 500px;
                height: 200px;
                text-align: center;
                color: #ddd;
                > p {
                    margin-top: 20px;
                }
            }
            .el-progress {
                display: block;
                width: 126px;
                margin: 0 auto;
            }
        }
        .top-wrap {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            .el-upload {
                display: block;
            }
            > .el-input {
                width: 350px;
            }
        }
    }
</style>

<script type="text/babel">
    import { SET_ALGORITHM_MAP } from '../../store/app/mutation-type'
    export default {
        data() {
            return {
                pluginList: [],
                loading: false,
                innerHeight: 0,
                q: {
                    pageIndex: 1,
                    pageSize: 20,
                    dateRange: '',
                    endTime: ''
                },
                progress: {
                    percent: 0,
                    status: null,
                    name: ''
                },
                showProgess: false,
                search: ''
            }
        },
        computed: {
            csrf() {
                return this.$store.state.csrf;
            },
            algorithmConf() {
                return this.$store.state.algorithmMap;
            },
            serverUrl() {
                return this.$store.state.serverUrl
            },
            pluginListFilter() {
                return this.pluginList.filter(data => {
                    data.open = false;
                    if (!this.search) return true;
                    const search = this.search.toLowerCase()
                    if (data.module.toLowerCase().includes(search)) return true;
                    if (data.type.toLowerCase().includes(search)) return true;
                    if (data.super_type.toLowerCase().includes(search)) return true;
                })
            }
        },
        methods: {
            handleExpand(row) {
                row.open = !row.open;
                this.$refs.multipleTable.toggleRowExpansion(row)
            },
            onProgress(event, file) {
                const { percent } = event;
                const { name } = file;
                this.progress.percent = percent.toFixed(1) - 0;
                this.progress.name = name;
            },
            loadingUi() {
                return this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            },
            indexMethod(index) {
                return (this.q.pageIndex - 1) * this.q.pageSize + index + 1
            },
            handleDelete(obj) {
                this.$confirm('此操作将删除该插件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.deletePlugin(obj);
                })
            },
            async deletePlugin(obj) {
                const loading = this.loadingUi();
                try {
                    const resp = await this.$request.plugin.deletePlugin(obj.plugin_id);
                    this.setAlgorithm();
                } catch (error) {
                    this.$message({
                        type: 'error',
                        message: '删除插件失败！'
                    })
                    throw error;
                } finally {
                    loading.close();
                }
            },
            getInnerHeight() {
                if (EASY_ENV_IS_BROWSER) {
                    this.innerHeight = this.$el.clientHeight - 160;
                }
            },
            beforeAvatarUpload(file) {
                const isLt200M = file.size / 1024 / 1024 < 200;
                if (!isLt200M) {
                    this.$message.error('上传文件大小不能超过 200MB!');
                }
                if (isLt200M) {
                    this.showProgess = true;
                }
                return isLt200M;
            },
            uploadError(err, file, fileList) {
                this.$message({
                    message: `上传失败，${err.status}`,
                    type: 'error'
                })
                this.progress.status = 'exception'
                this.clearProgress();
            },
            clearProgress() {
                setTimeout(() => {
                    this.showProgess = false;
                    this.progress.percent = 0;
                    this.progress.status = null;
                }, 1500);
            },
            setAlgorithm(response) {
                if (response) {
                    this.$message({
                        type: 'info',
                        message: response
                    })
                    if (response.indexOf('error') != -1) {
                        this.progress.status = 'exception'
                    }
                }
                this.$store.dispatch(SET_ALGORITHM_MAP);
            }
        },
        mounted() {
            this.getInnerHeight();
            $(window).on('resize.upload', this.getInnerHeight);
        },
        watch: {
            'progress.percent': function(p) {
                if (p == 100) {
                    this.clearProgress();
                }
            },
            algorithmConf(obj) {
                this.pluginList = Object.values(obj);
            }
        },
        beforeMount() {
            this.pluginList = Object.values(this.algorithmConf);
        },
        beforeDestroy() {
            $(window).off('resize.upload');
        }
    };
</script>