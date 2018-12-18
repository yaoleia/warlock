<template>
    <div class="upload-page">
        <el-upload class="uploader" accept=".qz" drag action="/api/upload" multiple :on-success='uploadSuccess' :before-upload="beforeAvatarUpload" :on-error='uploadError' :with-credentials='true' :headers="{'x-csrf-token':csrf}">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传.qz文件</div>
        </el-upload>
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

            }
        },
        computed: {
            csrf() {
                return this.$store.state.csrf;
            }
        },
        methods: {
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
            }
        }
    };
</script>