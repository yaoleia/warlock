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
            <imgStream :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
        </div>
    </div>
</template>
<style lang="less">
    .dashboard {
      display: flex;
      justify-content: space-between;
      height: 100%;
      .col {
        &.left-img-col {
          height: calc(~"(100%)/3");
        }
        &.middle-img-col {
          height: 100%;
        }
        &.right-img-col {
          height: 50%;
        }
      }
    }
</style>