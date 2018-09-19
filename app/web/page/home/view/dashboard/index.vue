<script type="text/babel">
    import imgStream from "component/imgStream"
    import magnifier from "component/magnifier"
    export default {
      data() {
        return {
          imgMagnifier: {
            src: ""
          },
          opts: {}
        }
      },
      computed: {
        serverUrl() {
          return this.$store.state.serverUrl
        }
      },
      beforeMount() {
        // 只会在浏览器执行
        // this.$options.components.webcam = () => import("component/webcam")
      },
      methods: {
        resize() {
          if (window.innerWidth < 1440) {
            this.opts = {
              width: 320,
              height: 240,
              dest_width: 320,
              dest_height: 240,
              crop_width: 320,
              crop_height: 213
            }
          } else {
            this.opts = {}
          }
        }
      },
      activated() {
        let video = document.querySelectorAll("video")[0]
        if (video) {
          video.play()
        }
      },
      mounted() {
        this.resize()
        window.onresize = () => {
          this.resize()
        }
      },
      components: {
        imgStream,
        magnifier
      }
    }
</script>
<template>
    <div class="dashboard">
        <div class="left-img-col col">
            <imgStream class="h280" :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
            <imgStream class="h280" :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
            <el-card class="msg">检测结果：</el-card>
        </div>
        <div class="middle-img-col col">
            <magnifier :imgMagnifier="imgMagnifier" :pic="`/api/proxyurl?url=${serverUrl}video_feed`">
                <imgStream :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
            </magnifier>
        </div>
        <div class="right-img-col col">
            <imgStream :url="imgMagnifier.src"></imgStream>
            <!-- <el-card class="img-stream h280">
                <webcam :opts="opts"></webcam>
            </el-card> -->
            <imgStream class="h280" :url="`/api/proxyurl?url=${serverUrl}video_feed`"></imgStream>
        </div>
    </div>
</template>
<style lang="less">
    ::selection {
      background: transparent;
    }
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
          .msg {
            height: 200px;
            width: 100%;
          }
        }
        &.middle-img-col {
          .img-stream {
            height: 100%;
          }
        }
        &.right-img-col {
          position: relative;
          .img-stream {
            height: 420px;
          }
        }
        .img-stream.h280 {
          height: 280px;
        }
      }
      background: lightblue;
    }
    @media screen and (max-width: 1440px) {
      .dashboard {
        .col {
          width: 320px;
          height: 640px;
          &.left-img-col {
            .img-stream {
              height: calc(~"320px / 1.5");
            }
            .msg {
              height: 25%;
            }
          }
          &.right-img-col {
            .img-stream {
              height: 320px;
            }
            .img-stream.h280 {
              height: calc(~"320px / 1.5");
            }
          }
        }
      }
    }
</style>