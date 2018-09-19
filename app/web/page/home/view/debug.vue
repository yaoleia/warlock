<template>
    <div class="debug">
        <headerBtns />
        <div class="right-content">
            <el-tabs v-model="activeName">
                <el-tab-pane label="主摄像机" name="main"></el-tab-pane>
                <el-tab-pane label="辅助摄像机" name="assist"></el-tab-pane>
            </el-tabs>
            <imgStream v-if="activeName=='main'" class="" :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
            <imgStream v-if="activeName=='assist'" class="h280" :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
        </div>
    </div>
</template>
<style lang="scss">
    .debug {
      margin: 0 auto;
      padding-top: 30px;
      width: 1440px;
      display: flex;
      justify-content: space-around;
      .header-btns {
        height: auto;
        margin-right: 100px;
      }
      .right-content {
        width: 900px;
        height: 600px;
        .el-tabs__nav-wrap {
            height: 40px;
        }
        .img-stream {
          width: 780px;
          height: 520px;
        }
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
