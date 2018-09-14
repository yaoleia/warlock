<template>
    <div class="navs-wrap">
        <el-menu router :default-active="tabactive" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="/">返回主页</el-menu-item>
            <el-menu-item index="/article/list">查看历史</el-menu-item>
            <el-menu-item index="/article/detail">帮助</el-menu-item>
        </el-menu>
        <el-popover popper-class="navs-popover" placement="bottom" width="220" trigger="manual" v-model="visible">
            <headerBtns />
            <el-button slot="reference" type="text" class="console" @click="visible = !visible">调试</el-button>
        </el-popover>
    </div>
</template>
<script type="text/babel">
    import headerBtns from "./headerBtns.vue"
    export default {
      data() {
        return {
          tabactive: "/",
          visible: false
        }
      },
      components: {
        headerBtns
      }
    }
</script>
<style lang="scss">
    .navs-wrap {
      position: absolute;
      left: 100px;
      top: 0;
      width: 600px;
      display: flex;
    }
    .navs-popover.el-popover {
      color: #fff;
      padding: 0;
      min-width: 100px;
      background: #3c8dbc;
      .popper__arrow {
        border-bottom-color: #3c8dbc;
        &::after {
          border-bottom-color: #3c8dbc;
        }
      }
      .el-menu-item:focus, .el-menu-item:hover {
          background: none;
      }
      .el-submenu__title:hover {
          background: none;
      }
      .el-submenu__title {
          color: #fff;
      }
      .el-menu-item {
          color: #fff;
      }
      .el-submenu__title i {
          color: #fff;
      }
    }
    .console {
      color: #fff;
      line-height: 50px;
      padding: 0 30px;
    }
    .el-button--text:hover {
      color: #fff;
    }
    .el-button--text:focus,
    .el-button--text:hover {
      color: #fff;
    }
    .el-dropdown-menu__item--divided:before,
    .el-menu,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
      background: none;
      color: #fff;
    }
    .el-menu--horizontal > .el-menu-item.is-active {
      color: #fff;
      background: none;
      border-bottom: 2px solid #fff;
    }
    .el-menu--horizontal > .el-menu-item {
      line-height: 50px;
      height: 50px;
      color: #fff;
    }
</style>

