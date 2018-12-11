<template>
    <div class="detail-pannel">
        <div id="node_detailpannel" data-status="node-selected" class="pannel">
            <div class="pannel-title">模块详情</div>
            <div class="block-container">
                <div v-if="selectedModel && selectedModel.module">
                    <div class="title">{{selectedModel.shape}}</div>
                    <el-form @submit.native.prevent v-if='selectedModel.init_params'>
                        <div class="params-title"><i class="el-icon-info"></i> init_params</div>
                        <el-form-item :label='key+":"' v-for='(item,key) in selectedModel.init_params' :key='key'>
                            <el-input v-model="item.value" :disabled="readMode" />
                        </el-form-item>
                    </el-form>
                    <el-form @submit.native.prevent v-if='selectedModel.exec_params'>
                        <div class="params-title"><i class="el-icon-info"></i> exec_params</div>
                        <el-form-item :label='key+":"' v-for='(item,key) in selectedModel.exec_params' :key='key'>
                            <el-input v-model="item.value" :disabled="readMode" />
                        </el-form-item>
                    </el-form>
                    <el-form @submit.native.prevent v-if='selectedModel.exec_outputs'>
                        <div class="params-title"><i class="el-icon-info"></i> exec_outputs</div>
                        <el-form-item :label='key+":"' v-for='(item,key) in selectedModel.exec_outputs' :key='key'>
                            <el-input v-model="item.value" :disabled="readMode" />
                        </el-form-item>
                    </el-form>
                    <!-- <div v-if="selectedModel.shape === 'factory-card'">
                        <el-form label-width="80px" label-position="left" @submit.native.prevent>
                            <el-form-item label="名称：" prop="label">
                                <el-input v-model="inputingLabel" />
                            </el-form-item>
                            <el-form-item label="字体颜色：" prop="color">
                                <el-color-picker v-model="color" size="mini" />
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="selectedModel.shape!== 'factory-card'">
                        <el-form label-width="60px" @submit.native.prevent>
                            <el-form-item label="名称：">
                                <el-input v-model="inputingLabel" />
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="selectedModel.shape === 'distortion-correction'">
                        <el-form label-width="60px" @submit.native.prevent>
                            <el-form-item :label="item.key+':'" v-for="item in selected.item.shapeObj.optionList" :key="item.key">
                                <el-input @keyup.native='inputChange($event,item.key)' v-model="selectedModel[item.key]" />
                            </el-form-item>
                        </el-form>
                        <el-checkbox-group v-model="checkedBox" class="check-box">
                            <el-checkbox v-for="item in selected.item.shapeObj.checkBoxList" :label="item.key" :key="item.key"></el-checkbox>
                        </el-checkbox-group>
                    </div> -->
                </div>
            </div>
        </div>
        <div id="edge_detailpannel" data-status="edge-selected" class="pannel">
            <div class="pannel-title">线详情</div>
            <div class="block-container">
                <el-form label-width="60px" @submit.native.prevent>
                    <el-form-item label="名称：">
                        <el-input v-model="inputingLabel" />
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div id="node_detailpannel" data-status="group-selected" class="pannel">
            <div class="pannel-title">群组详情</div>
            <div class="block-container">
                <el-input v-model="inputingLabel" />
            </div>
        </div>
        <div id="canvas_detailpannel" data-status="canvas-selected" class="pannel">
            <div class="pannel-title">画布</div>
            <div class="block-container">
                <el-checkbox @change="e=>$emit('toggleGrid',e)">网格对齐</el-checkbox>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                checkedBox: []
            };
        },
        props: ['selectedModel', 'readMode'],
        computed: {
            inputingLabel: {
                get() {
                    return this.selectedModel.label ? this.selectedModel.label : '';
                },
                set(value) {
                    this.$emit('updateGraph', ['label', value]);
                }
            },
            color: {
                get() {
                    return this.selectedModel.color ? this.selectedModel.color : '';
                },
                set(value) {
                    this.$emit('updateGraph', ['color', value]);
                }
            }
        },
        methods: {
            inputChange(e, attr) {
                this.$emit('updateGraph', [attr, e.target.value]);
            }
        },
        watch: {
            checkedBox(arr) {
                this.$emit('updateGraph', ['checkedBox', arr]);
            }
        }
    };
</script>
<style lang="scss">
    .detail-pannel {
        height: calc(100% - 182px);
        position: absolute;
        right: 0px;
        z-index: 2;
        width: 200px;
        #node_detailpannel {
            height: 100%;
        }
        .params-title {
            color: #eee;
            background: #555;
            padding: 4px;
        }
        .pannel {
            display: none;
        }
        .input {
            margin-left: 16px;
        }
        .name-input {
            width: 120px;
        }
        .width-input {
            width: 52px;
        }
        .height-input {
            width: 52px;
        }
        .block-container {
            height: calc(100% - 32px);
            overflow: auto;
            padding: 16px 8px;
            text-align: left;
            .el-input__inner {
                color: #eee;
            }
            .el-form {
                margin-bottom: 30px;
            }
            .el-form-item {
                margin-bottom: 0;
            }
            .title {
                font-size: 15px;
                color: #eee;
                padding-bottom: 30px;
            }
            input {
                background: none;
                border-color: #ccc;
            }
            .check-box {
                margin: 30px 0;
            }
            .el-input.is-disabled .el-input__inner {
                background: #333;
                color: #ddd;
                border: none;
            }
        }
    }
</style>
