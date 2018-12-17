<template>
    <div class="upload-page">
        <el-upload class="uploader" drag action="/api/upload" multiple :with-credentials='true' :headers="{'x-csrf-token':csrf}">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传.gz文件</div>
        </el-upload>
    </div>
</template>

<style lang="scss">
    .upload-page {
        .uploader {
            width: 360px;
        }
    }
</style>

<script type="text/babel">
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
            upload() {

            },
        }
    };
</script>