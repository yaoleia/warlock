<template>
    <div class="detail-pannel">
        <div id="node_detailpannel" data-status="node-selected" class="pannel">
            <div class="pannel-title">模型详情</div>
            <div class="block-container">
                <div v-if="selectedModel && selectedModel.type === 'node'">
                    <div v-if="selectedModel.shape === 'factory-card'">
                        <el-form label-width="80px" label-position="left" @submit.native.prevent>
                            <el-form-item label="名称：" prop="label">
                                <el-input v-model="inputingLabel" />
                            </el-form-item>
                            <el-form-item label="字体颜色：" prop="color">
                                <el-color-picker v-model="color" size="mini" />
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="selectedModel.shape === 'k-means' || selectedModel.shape === 'random-forest'">
                        <el-form label-width="60px" @submit.native.prevent>
                            <el-form-item label="名称：">
                                <el-input v-model="inputingLabel" />
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <div id="edge_detailpannel" data-status="edge-selected" class="pannel">
            <div class="pannel-title">线详情</div>
            <div class="block-container">
                阿斯达
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
            };
        },
        props: ['selectedModel'],
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
        }
    };
</script>
<style lang="scss">
    .detail-pannel {
    	height: 100%;
    	position: absolute;
    	right: 0px;
    	z-index: 2;
    	background: #f7f9fb;
    	width: 200px;
    	border-left: 1px solid #e6e9ed;
    }
    .detail-pannel .pannel {
    	display: none;
    }
    .detail-pannel .block-containe {
    	padding-top: 20px;
    }
    .detail-pannel .input {
    	margin-left: 16px;
    }
    .detail-pannel .name-input {
    	width: 120px;
    }
    .detail-pannel .width-input {
    	width: 52px;
    }
    .detail-pannel .height-input {
    	width: 52px;
    }
    .detail-pannel .block-container {
    	padding: 16px 8px;
    	text-align: left;
    }
</style>
