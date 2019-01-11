<template>
    <div class="right-nav">
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
</template>
<script type="babel">
    export default {
        components: {
        },
        data() {
            return {

            };
        },
        props: ['handleDownload', 'exportOption', 'onFileAdd', 'designList'],
        computed: {},
        methods: {
            formReset() {
                this.$refs.optionForm.reset();
            }
        },
        mounted() {
        }
    };
</script>
<style lang="scss">
    .right-nav {
        display: flex;
        .export-wrap {
            display: flex;
            align-items: center;
        }
        .option-form {
            margin: 0 30px;
        }
        .export-mode {
            .el-input__inner {
                padding: 0 8px;
                width: 50px;
            }
            .el-select__caret {
                display: none;
            }
        }
    }
</style>
