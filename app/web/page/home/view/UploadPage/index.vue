<template>
    <div class="upload-page">
        <el-upload class="uploader" accept=".qz,.zip" drag action="/api/plugin" multiple :on-success='uploadSuccess' :before-upload="beforeAvatarUpload" :on-error='uploadError' :with-credentials='true' :headers="{'x-csrf-token':csrf}">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传.qz文件</div>
        </el-upload>
        <el-table ref="multipleTable" stripe :data="pluginList" v-loading="loading" :height="innerHeight">
            <div slot="empty">
                <p v-if='!loading'>No Content</p>
            </div>
            <!-- <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="id" label="ID">
            </el-table-column>
            <el-table-column prop="name" label="流程名称">
            </el-table-column>
            <el-table-column label="预览" width="300">
                <template slot-scope="scope">
                    <flow-displayer :flowData='scope.row.flowData' class="flow-wrap"></flow-displayer>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="170">
                <template slot-scope="scope">
                    <span v-text="$moment(scope.row.cts).format('YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="最后修改时间" width="170">
                <template slot-scope="scope">
                    <span v-text="$moment(scope.row.ts).format('YYYY-MM-DD HH:mm:ss')"></span>
                </template>
            </el-table-column>
            <el-table-column label="运行状态">
                <template slot-scope="scope">
                    <el-switch @change="activeChange(scope.row,$event)" v-model="scope.row.active"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="340">
                <template slot-scope="scope">
                    <div class="opration">
                        <div class="top-btn">
                            <el-button v-if='scope.row.active' title="外链" type="primary" @click="jumperHandle(scope.row.id)">
                                <v-icon name='wailian'></v-icon>
                            </el-button>
                            <router-link :to="{name: '新建流程',params: {id:scope.row.id,flow: scope.row}}">
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
            </el-table-column> -->
        </el-table>
    </div>
</template>

<style lang="scss">
    .upload-page {
        position: relative;
        .uploader {
            width: 360px;
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
                innerHeight: 0
            }
        },
        computed: {
            csrf() {
                return this.$store.state.csrf;
            }
        },
        methods: {
            indexMethod(index) {
                return (this.q.pageIndex - 1) * this.q.pageSize + index + 1
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
                const isLt100M = file.size / 1024 / 1024 < 100;
                if (!isLt100M) {
                    this.$message.error('上传头像图片大小不能超过 100MB!');
                }
                return isLt100M;
            },
            uploadError(err, file, fileList) {
                this.$message({
                    message: `上传失败，${err.status}`,
                    type: 'error'
                })
            },
            uploadSuccess() {
                this.$store.dispatch(SET_ALGORITHM_MAP);
            },
            async getPlugins() {
                const resp = await this.$request.get('/api/plugin');
                this.pluginList = resp.data;
            }
        },
        beforeMount() {
            this.getPlugins();
            this.getInnerHeight();
            $(window).on('resize.upload', this.getInnerHeight)
        },
        beforeDestroy() {
            $(window).off('resize.upload');
        }
    };
</script>