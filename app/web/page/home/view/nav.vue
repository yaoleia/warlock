<template>
    <div class="navs-wrap">
        <!-- <div class="block">
            <el-button type="text" @click="slider">暂停</el-button>
            <el-button type="text" @click="slider">前进</el-button>
            <el-slider v-model="value" :step="1" show-stops></el-slider>
            <el-button type="text" @click="slider">后退</el-button>
        </div> -->
        <el-menu router :default-active="tabactive" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="/">主页</el-menu-item>
            <el-menu-item index="/list">历史记录</el-menu-item>
            <el-menu-item index="/debug">参数调试</el-menu-item>
            <!-- <el-menu-item index="/help">帮助</el-menu-item> -->
        </el-menu>
    </div>
</template>
<script type="text/babel">
    export default {
      data() {
        return {
          tabactive: this.$route.path,
          value: 0
        }
      },
      mounted() {},
      watch: {
        "$route.path": function(p) {
          this.tabactive = p
        }
      },
      methods: {
        slider() {}
      },
      components: {}
    }
</script>
<style lang="scss">
    .block {
      padding-right: 30px;
      width: 530px;
      height: 50px;
      display: flex;
      justify-content: space-around;
      .el-button {
        color: #fff;
      }
      .el-slider {
        width: 350px;
      }
      .el-slider__runway {
        margin: 22px 0;
      }
    }
    .navs-wrap {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      margin: auto;
      width: 330px;
      display: flex;
    }
    .el-dropdown-menu__item--divided:before,
    .el-menu,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
      border-right: none;
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

