<template>
    <div class="context-menu">
        <div data-status="node-selected" class="menu">
            <div data-command="copy" class="command">
                <span>复制</span>
                <span>copy</span>
            </div>
            <div data-command="delete" class="command">
                <span>删除</span>
                <span>delete</span>
            </div>
        </div>
        <div data-status="edge-selected" class="menu">
            <div data-command="delete" class="command">
                <span>删除</span>
                <span>delete</span>
            </div>
        </div>
        <div data-status="group-selected" class="menu">
            <div data-command="copy" class="command">
                <span>复制</span>
                <span>copy</span>
            </div>
            <div data-command="delete" class="command">
                <span>删除</span>
                <span>delete</span>
            </div>
            <div data-command="unGroup" class="command">
                <span>解组</span>
                <span>unGroup</span>
            </div>
        </div>
        <div data-status="canvas-selected" class="menu">
            <div data-command="undo" class="command">
                <span>撤销</span>
                <span>undo</span>
            </div>
            <div data-command="redo" class="command">
                <span>重做</span>
                <span>redo</span>
            </div>
            <div data-command="pasteHere" class="command">
                <span>粘贴</span>
                <span>pasteHere</span>
            </div>
        </div>
        <div data-status="multi-selected" class="menu">
            <div data-command="copy" class="command">
                <span>复制</span>
                <span>copy</span>
            </div>
            <div data-command="paste" class="command">
                <span>粘贴</span>
                <span>paste</span>
            </div>
            <div data-command="addGroup" class="command">
                <span>归组</span>
                <span>addGroup</span>
            </div>
            <div data-command="delete" class="command">
                <span>删除</span>
                <span>delete</span>
            </div>
        </div>
        <div class="all-selected">
            <el-button type="text" @click="$emit('terminalFor','output')">
                <v-icon name="console" /> 查看输出</el-button>
            <el-button type="text" @click="$emit('terminalFor','run')">
                <v-icon name="play" /> 查看运行</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: 'contextMenu'
            };
        }
    };
</script>
<style lang="scss">
    .context-menu {
        margin: 0px;
        width: 200px;
        background: white;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
        color: #000;
        font-size: 12px;
        display: none;
        border-radius: 4px;
        .all-selected {
            padding-right: 5px;
            border-top: 1px solid #444;
            display: flex;
            justify-content: space-around;
            .el-button--text {
                color: #000;
            }
            .el-button:hover {
                color: #ff8800;
            }
        }
        .disable {
            color: rgba(0, 0, 0, 0.25);
        }
        .command {
            height: 16px;
            padding: 8px;
            box-sizing: content-box;
            &:hover {
                cursor: pointer;
                background: #e6f7ff;
            }
            &.disable:hover {
                cursor: default;
                background: none;
            }
        }
        span:nth-of-type(1) {
            float: left;
        }
        span:nth-of-type(2) {
            float: right;
        }
        .menu {
            padding: 5px 3px;
        }
    }
</style>
