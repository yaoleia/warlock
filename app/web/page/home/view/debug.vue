<template>
    <div class="debug">
        <headerBtns />
        <div class="right-content">
            <el-tabs v-model="activeName">
                <el-tab-pane label="主摄像机" name="main"></el-tab-pane>
                <el-tab-pane label="辅助摄像机" name="assist"></el-tab-pane>
            </el-tabs>
            <imgStream v-if="activeName=='main'" class="" :url="`/api/proxyurl?url=${serverUrl}/video_feed`"></imgStream>
            <imgStream v-if="activeName=='assist'" class="h280" :url="`/api/proxyurl?url=${serverUrl}/video_feed`"></imgStream>
        </div>
    </div>
</template>
<style lang="scss">
    .debug {
      margin: 0 auto;
      padding-top: 30px;
      width: 1420px;
      display: flex;
      justify-content: space-between;
      .header-btns {
        height: auto;
        margin-right: 100px;
      }
      .right-content {
        width: 1100px;
        height: 730px;
        .el-tabs__nav-wrap {
          height: 40px;
        }
        .img-stream {
          width: 1002px;
          height: 668px;
        }
      }
      .el-tabs__item {
        color: #fff;
        opacity: 0.7;
      }
      .el-tabs__item.is-active {
        color: #ff8800;
        opacity: 1;
      }
      .el-tabs__active-bar {
        background-color: #ff8800;
      }
      .el-tabs__nav-wrap::after {
          background: none;
      }
    }
</style>
<script type="babel">
    import headerBtns from "./headerBtns.vue"
    import imgStream from "component/imgStream"
    export default {
      data() {
        return {
          activeName: "main"
        }
      },
      components: {
        headerBtns,
        imgStream
      },
      computed: {
        serverUrl() {
          return this.$store.state.serverUrl
        }
      },
      methods: {},
      beforeMount() {}
    }
</script>
