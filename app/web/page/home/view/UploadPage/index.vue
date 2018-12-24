<template>
    <div class="upload-page">
        <el-upload class="uploader" accept=".qz,.zip" drag action="/api/plugin" name='file' multiple :on-success='setAlgorithm' :before-upload="beforeAvatarUpload" :on-error='uploadError' :with-credentials='true' :headers="{'x-csrf-token':csrf}">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传.qz文件</div>
        </el-upload>
        <el-table ref="multipleTable" stripe :data="pluginList" v-loading="loading" :height="innerHeight">
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
                            <el-button title="删除" type="text" @click="deletePlugin(scope.row)">
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
            width: 360px;
        }
        .demo-table-expand {
            display: flex;
            justify-content: space-between;
            > .el-form-item {
                padding: 0 10px;
                flex: 1;
            }
        }
        .el-table__expand-icon--expanded {
            color: #ff8800;
            font-weight: bolder;
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
                }
            }
        },
        computed: {
            csrf() {
                return this.$store.state.csrf;
            },
            algorithmConf() {
                return this.$store.state.algorithmMap;
            }
        },
        methods: {
            indexMethod(index) {
                return (this.q.pageIndex - 1) * this.q.pageSize + index + 1
            },
            async deletePlugin(obj) {
                const resp = await this.$request.delete(`/api/plugin/${obj.plugin_key}`);
                this.setAlgorithm();
            },
            getInnerHeight() {
                if (EASY_ENV_IS_BROWSER) {
                    if (window.innerWidth <= 1920) {
                        this.innerHeight = 620;
                    } else {
                        this.innerHeight = 890;
                    }
                }
            },
            beforeAvatarUpload(file) {
                const isLt100M = file.size / 1024 / 1024 < 200;
                if (!isLt100M) {
                    this.$message.error('上传头像图片大小不能超过 200MB!');
                }
                return isLt100M;
            },
            uploadError(err, file, fileList) {
                this.$message({
                    message: `上传失败，${err.status}`,
                    type: 'error'
                })
            },
            setAlgorithm() {
                this.$store.dispatch(SET_ALGORITHM_MAP);
            }
        },
        watch: {
            algorithmConf(obj) {
                this.pluginList = Object.values(obj);
            }
        },
        beforeMount() {
            this.getInnerHeight();
            $(window).on('resize.upload', this.getInnerHeight);
            this.pluginList = Object.values(this.algorithmConf);
        },
        beforeDestroy() {
            $(window).off('resize.upload');
        }
    };
</script>