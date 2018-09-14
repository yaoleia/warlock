<script type="text/babel">
    import imgStream from "component/imgStream"
    export default {
      computed: {
        serverUrl() {
          return this.$store.state.serverUrl
        }
      },
      components: {
        imgStream
      }
    }
</script>
<template>
    <div class="dashboard">
        <div class="left-img-col col">
            <imgStream :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
            <imgStream :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
            <imgStream :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
        </div>
        <div class="middle-img-col col">
            <imgStream :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
        </div>
        <div class="right-img-col col">
            <imgStream :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
            <el-card class="msg img-stream">msg</el-card>
        </div>
    </div>
</template>
<style lang="less">
    .dashboard {
      display: flex;
      justify-content: space-around;
      height: calc(~"100% - 20px");
      box-sizing: border-box;
      padding: 0 30px;
      .col {
        // width: calc(~"(100% - 120px)/3");
        max-width: calc(~"(150vh - 75px)/3");
        flex: 1;
        &.left-img-col {
          .img-stream {
            height: calc(~"(100% - 30px)/3");
          }
        }
        &.middle-img-col {
          .img-stream {
            height: calc(~"(100% - 10px)");
          }
        }
        &.right-img-col {
          .img-stream {
            height: calc(~"(100% - 20px)/2");
          }
        }
      }
    }
</style>