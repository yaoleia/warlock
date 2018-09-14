<template>
    <div class="header-btns">
        <el-dropdown trigger="click">
            <span class="el-dropdown-link">
                硬件
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>主摄像机</el-dropdown-item>
                <el-dropdown-item>辅助摄像机</el-dropdown-item>
                <el-dropdown-item>光源</el-dropdown-item>
                <el-dropdown-item>激光触发</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click">
            <span class="el-dropdown-link">
                算法
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>差分</el-dropdown-item>
                <el-dropdown-item>检测</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script type="text/babel">
    export default {
      components: {},
      data() {
        return {}
      }
    }
</script>
<style lang="scss">
    .header-btns {
      .el-dropdown {
        line-height: 50px;
        margin: 0 30px;
        cursor: pointer;
        color: #fff;
      }
    }
</style>

