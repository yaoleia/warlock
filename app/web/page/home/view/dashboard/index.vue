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
            <el-card class="msg img-stream">msg</el-card>
        </div>
        <div class="middle-img-col col">
            <imgStream :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
        </div>
        <div class="right-img-col col">
            <imgStream :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
            <imgStream :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
        </div>
    </div>
</template>
<style lang="less">
    .dashboard {
      display: flex;
      justify-content: space-around;
      box-sizing: border-box;
      padding: 0 20px;
      height: 100%;
      align-items: center;
      .col {
        width: 420px;
        height: 840px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        &.left-img-col {
          .img-stream {
            height: 280px;
          }
        }
        &.middle-img-col {
          .img-stream {
            height: 100%;
          }
        }
        &.right-img-col {
          .img-stream {
            height: 420px;
          }
        }
      }
      background: lightblue;
    }
    @media screen and (max-width: 1440px) {
      .dashboard {
        .col {
          width: 320px;
          height: 640px;
        }
      }
    }
</style>