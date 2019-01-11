<template>
    <div class="context-menu" @contextmenu.stop.prevent>
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
    export default {
        components: {
        },
        data() {
            return {

            };
        },
        props: ['handleCopy', 'handleDelete', 'handleDownload', 'active'],
        computed: {},
        methods: {
        },
        mounted() {
        }
    };
</script>
<style lang="scss">
    .context-menu {
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
