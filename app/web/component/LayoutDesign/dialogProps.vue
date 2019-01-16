<template>
    <div class="dialog-props-wrap">
        <div v-for="(value,key) in curElement.editProps" :key='key'>
            <div>{{key}}:</div>
            <el-select v-if='!curElement.editProps[key].switch' v-model="curElement.editProps[key].bind" placeholder="请选择" clearable>
                <el-option v-for="item in output" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
            <el-autocomplete v-else class="inline-input" v-model="curElement.editProps[key].bind" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
            <el-switch v-model="curElement.editProps[key].switch"></el-switch>
        </div>
        <div class="surface">
            <div class="block">
                <span>left:</span>
                <el-slider v-model="curElement.left" show-input :max='1000' :min="0" :step='5'></el-slider>
            </div>
            <div class="block">
                <span>top:</span>
                <el-slider v-model="curElement.top" show-input :max='1000' :min="0" :step='5'></el-slider>
            </div>
            <div class="block">
                <span>width:</span>
                <el-slider v-model="curElement.width" show-input :max='1000' :min="150" :step='5'></el-slider>
            </div>
            <div class="block">
                <span>height:</span>
                <el-slider v-model="curElement.height" show-input :max='1000' :min="150" :step='5'></el-slider>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    .dialog-props {
        background: rgba(0, 0, 0, 0.6);
        .el-dialog__title {
            color: #bbb;
        }
        .dialog-props-wrap {
            > div {
                margin-bottom: 5px;
                line-height: 2;
                color: #ddd;
            }
            .el-input {
                width: 190px;
                margin-right: 30px;
            }
        }
        .surface {
            .el-input {
                width: 100%;
            }
        }
    }
</style>
<script type="text/babel">
    export default {
        data() {
            return {
            };
        },
        props: {
            curElement: {
                type: Object,
                required: false
            },
            output: {
                type: Array,
                required: false
            }
        },
        components: {
        },
        mounted() { },
        methods: {
            querySearch(queryString, cb) {
                const result = this.output.map(k => ({ value: k }))
                cb(result)
            },
        }
    };
</script>