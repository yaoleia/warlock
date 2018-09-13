<template>
   <div class='main'>
     <LayoutHeader></LayoutHeader>
     <LayoutContent>
       <div slot='content'><slot name='main'></slot></div>
     </LayoutContent>
   </div>
</template>
<style lang='less'>
  .main {
    display: flex;
    .el-menu:not(.el-menu--collapse) {
      width: 230px;
    }
    .app {
      width: 100%;
      background-color: #ecf0f5;
    }
  
    .app-body {
      width: 100%;
      height: calc(~'100% - 50px');
      position: absolute;
      left: 0;
      top: 50px;
      overflow: auto;
    }
    .main-container {
      height: 100%;
    }
  }
</style>
<script type='babel'>
  import LayoutHeader from './header/header';
  import LayoutContent from './content/content';
  export default {
    components: {
      LayoutHeader,
      LayoutContent
    }
  };
</script>
