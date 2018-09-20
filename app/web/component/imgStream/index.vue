<template>
    <el-card class="img-stream" :class="{visibility:!show}">
        <p class="title" v-if="title">{{title}}</p>
        <img :src="url" class="img" @load="loaded" v-if="url">
    </el-card>
</template>
<style lang="scss">
    .img-stream {
      box-sizing: border-box;
      position: relative;
      width: 100%;
      height: 100%;
      &.el-card {
        border: none;
      }
      .el-card__body {
        padding: 0;
        height: 100%;
      }
      .img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
      .msg {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #ccc;
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
      props: ["url", "title"],
      components: {},
      mounted() {},
      methods: {
        loaded() {
          this.show = true
        }
      }
    }
</script>
