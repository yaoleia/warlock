<template>
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
</template>
<script type="babel">
    export default {
        components: {
        },
        data() {
            return {

            };
        },
        props: ['uploadOption', 'uploadCancel', 'uploadDesignList'],
        computed: {},
        methods: {
            handleCheckAllChange(val) {
                this.uploadOption.checkedList = val ? this.uploadOption.uploadList.map(li => li._id) : [];
                this.uploadOption.isIndeterminate = false;
            },
            handleCheckedChange(value) {
                const checkedCount = value.length;
                const uploadCount = this.uploadOption.uploadList.length;
                this.uploadOption.checkAll = checkedCount === uploadCount;
                this.uploadOption.isIndeterminate = checkedCount > 0 && checkedCount < uploadCount;
            }
        },
        mounted() {
        }
    };
</script>
<style lang="scss">
    .upload-pop-dialog {
        width: 500px;
    }
</style>
