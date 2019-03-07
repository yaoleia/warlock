<template>
    <div class="copy-wrap">
        <el-tooltip class="item" effect="light" :content="value" placement="top-start">
            <i class="substring-id">{{subStringVal}}...</i>
        </el-tooltip>
        <textarea ref='hideInput'></textarea>
        <el-tooltip class="item" effect="light" content="复制" placement="bottom-start">
            <img class="copy-btn" src="~asset/images/copy.png" @click="clickCopy" />
        </el-tooltip>
    </div>
</template>

<script>
    export default {
        name: 'copyText',
        props: {
            value: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                show: true
            }
        },
        methods: {
            clickCopy() {
                const input = this.$refs.hideInput;
                input.value = this.value;
                input.select();
                document.execCommand('copy');
                this.$message({
                    message: '复制成功！',
                    type: 'success'
                });
            }
        },
        computed: {
            subStringVal() {
                const str = this.value;
                const subStr = str.length > 10 ? str.substring(0, 10) : str;
                return subStr;
            }
        }
    }
</script>

<style lang="scss">
    .copy-wrap {
        display: inline-block;
        textarea {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            z-index: -10;
        }
        .copy-btn {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        .substring-id {
            cursor: pointer;
        }
    }
</style>