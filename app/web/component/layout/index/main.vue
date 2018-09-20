<template>
    <div class='main'>
        <LayoutHeader>
            <slot name="header"></slot>
        </LayoutHeader>
        <LayoutContent></LayoutContent>
    </div>
</template>
<style lang='less'>
    #app {
      height: 100%;
      background-image: linear-gradient(to bottom, #2d2d2d, #252121);
    }
    html,
    body {
      overflow: auto;
    }
    .main {
      height: 100%;
      position: relative;
      //   display: flex;
      .el-menu:not(.el-menu--collapse) {
        // width: 230px;
      }
      .app {
        width: 100%;
        background-color: #ecf0f5;
      }

      .app-body {
        box-sizing: border-box;
        width: 100%;
        height: calc(~"100% - 120px");
        padding-top: 20px;
        overflow: auto;
        background-image: linear-gradient(to bottom, #2d2d2d, #252121);
      }
      .main-container {
        height: 100%;
      }
    }
</style>
<script type='babel'>
    import LayoutHeader from "./header/header"
    import LayoutContent from "./content/content"
    export default {
      components: {
        LayoutHeader,
        LayoutContent
      }
    }
</script>
