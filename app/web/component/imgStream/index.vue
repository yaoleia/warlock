<template>
    <el-card class="img-stream" :class="{visibility:!show}">
        <img :src="url" class="img" @load="loaded">
    </el-card>
</template>
<style lang="scss">
    .img-stream {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 5px;
      .el-card__body {
        padding: 0;
        height: 100%;
      }
      .img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
    .visibility {
    //   visibility: hidden;
    }
</style>
<script type="text/babel">
    export default {
      data() {
        return {
          show: false
        }
      },
      props: ["url"],
      components: {},
      mounted() {},
      methods: {
        loaded() {
            this.show = true
        }
      }
    }
</script>
