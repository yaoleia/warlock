<template>
    <div class="toolbar">
        <div class="redo">
            <i data-command="undo" class="command iconfont icon-undo" title="撤销" />
            <i data-command="redo" class="command iconfont icon-redo" title="重做" />
            <el-button type="text" class="reset" @click="$emit('read')" title="恢复初始">
                <v-icon name='huifu'></v-icon>
            </el-button>
        </div>
        <div class="copy">
            <i data-command="copy" class="command iconfont icon-copy-o" title="复制" />
            <i data-command="paste" class="command iconfont icon-paster-o" title="粘贴" />
            <i data-command="delete" class="command iconfont icon-delete-o" title="删除" />
        </div>
        <div class="zoom">
            <i data-command="zoomIn" class="command iconfont icon-zoom-in-o" title="放大" />
            <i data-command="zoomOut" class="command iconfont icon-zoom-out-o" title="缩小" />
            <i data-command="autoZoom" class="command iconfont icon-fit" title="适应画布" />
            <v-icon data-command="resetZoom" class="command" title="实际尺寸" name='bi'></v-icon>
        </div>
        <div class="z-index">
            <i data-command="toBack" class="command iconfont icon-to-back" title="层级后置" />
            <i data-command="toFront" class="command iconfont icon-to-front" title="层级前置" />
        </div>
        <div class="groups">
            <i data-command="multiSelect" class="command iconfont icon-select" title="多选" />
            <i data-command="addGroup" class="command iconfont icon-group" title="成组" />
            <i data-command="unGroup" class="command iconfont icon-ungroup" title="解组" />
        </div>
        <el-select v-model="lineType" placeholder="请选择" class="select-line">
            <el-option-group label="折线">
                <el-option label="圆角" value="flow-polyline-round"></el-option>
                <el-option label="直角" value="flow-polyline"></el-option>
            </el-option-group>
            <el-option-group label="其它">
                <el-option label="曲线" value="flow-smooth"></el-option>
                <el-option label="虚线" value="line"></el-option>
            </el-option-group>
        </el-select>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                name: 'toolbar',
                lineType: 'flow-polyline-round'
            };
        },
        watch: {
            lineType(value) {
                this.$emit('change-eage', value);
            }
        }
    };
</script>
<style lang="scss">
    @import url("~asset/css/editer.css");
    .toolbar {
        width: 100%;
        height: 50px;
        text-align: left;
        color: #eee;
        display: flex;
        align-items: center;
        .reset {
            width: 45px;
            height: 33px;
            padding: 0;
            vertical-align: middle;
        }
        .el-select {
            width: 100px;
            .el-input__inner {
                height: 33px;
                line-height: 33px;
                background: none;
                color: #eee;
                border: none;
            }
            .el-input__icon {
                line-height: 33px;
            }
            .el-icon-arrow-up:before {
                font-size: 17px;
            }
        }
        .select-line,
        .redo,
        .copy,
        .zoom,
        .z-index,
        .groups {
            border: 1px solid #444;
            border-radius: 3px;
            margin: 0 10px;
        }
        .btns {
            margin-left: 40px;
        }
        .iconfont {
            vertical-align: middle;
        }
        *::before {
            font-size: 24px;
        }
        .disable {
            color: rgba(200, 200, 200, 0.4);
        }
        .icon-select.disable {
            background: #666;
            color: #eee;
        }
        .separator {
            margin: 5px;
        }
        .command {
            width: 33px;
            height: 33px;
            margin: 0 4px;
            border-radius: 2px;
            padding: 2px 0 0 3px;
            display: inline-block;
            vertical-align: middle;
            transition: all 0.1s;
            &:hover {
                cursor: pointer;
                color: #ff8800;
            }
            &.disable:hover {
                cursor: default;
                color: rgba(200, 200, 200, 0.4);
            }
        }
    }
</style>
