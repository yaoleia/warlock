<template>
    <div class="list-context-menu" @contextmenu.stop.prevent>
        <el-button type="text" @click="handleCopy(active)">
            <v-icon name='s-clonekelong'></v-icon> 克隆
        </el-button>
        <el-button type="text" @click="handleDelete(active)">
            <v-icon name='shanchu'></v-icon> 删除
        </el-button>
        <el-button type="text" @click='handleDownload([active])'>
            <v-icon name='xiazai'></v-icon> 导出
        </el-button>
    </div>
</template>
<script type="babel">
    import _ from 'lodash';
    export default {
        props: ['creatWorkflow', 'deleteWorkflow', 'handleDownload', 'active'],
        methods: {
            async handleCopy(item) {
                let newItem = _.cloneDeep(item);
                const { flowData, layout, output, name } = newItem;
                newItem = { flowData, layout, output, active: false, ts: new Date().getTime(), cts: new Date().getTime() }
                this.$prompt('请输入新克隆的流程名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: `${name}_copy_${new Date().getTime()}`
                }).then(async ({ value }) => {
                    newItem.name = value;
                    await this.creatWorkflow(newItem);
                    this.$message({
                        type: 'success',
                        message: `克隆流程 ${value} 成功！`
                    });
                })
            },
            handleDelete(item) {
                let msg = '此操作将删除该流程, 是否继续?';
                if (item.active) {
                    msg = '*任务正在运行,此操作将关闭任务*，' + msg;
                }
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.deleteWorkflow(item);
                })
            }
        }
    };
</script>
<style lang="scss">
    .list-context-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: auto;
        z-index: 10;
        display: flex;
        flex-direction: column;
        background: #444;
        border-radius: 5px;
        padding: 5px 0;
        box-shadow: 1px 0 5px 0 rgba($color: #000, $alpha: 0.8);
        .el-button--text {
            cursor: pointer;
            margin: 0;
            padding: 10px 15px;
        }
    }
</style>
