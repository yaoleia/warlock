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
            <imgStream class="mb30" title="拍摄原图" :url="`/api/proxyurl?url=${serverUrl}/video_feed`"></imgStream>
            <imgStream class="" title="目标定位" :url="`/api/proxyurl?url=${serverUrl}/video_feed`"></imgStream>
        </div>
        <div class="middle-img-col col">
            <p class="title">检测结果</p>
            <magnifier :imgMagnifier="imgMagnifier" :pic="`/api/proxyurl?url=${serverUrl}/video_feed`">
                <imgStream :url="`/api/proxyurl?url=${serverUrl}/video_feed`"></imgStream>
            </magnifier>
        </div>
        <div class="right-img-col col">
            <imgStream class="result mb30" title="局部放大" :url="imgMagnifier.src"></imgStream>
            <!-- <el-card class="img-stream">
                <webcam :opts="opts"></webcam>
            </el-card> -->
            <el-card class="msg mb30">
                <p class="title">检测结果详情</p>
            </el-card>
            <imgStream title="监控" class="" :url="`/api/proxyurl?url=${serverUrl}/video_feed`"></imgStream>
        </div>
    </div>
</template>
<style lang="less">
    ::selection {
      background: transparent;
    }
    .dashboard {
      box-sizing: border-box;
      height: 100%;
      display: table;
      margin: 0 auto;
      min-width: 1900px;
      .col {
        float: left;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .mb30 {
          margin-bottom: 30px;
        }
        .img-stream {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 18px;
          padding: 66px 60px 60px;
          .el-card__body {
            border-radius: 12px;
            overflow: hidden;
          }
        }
        p.title {
          font-size: 24px;
          line-height: 66px;
          position: absolute;
          left: 60px;
          top: 0;
          color: #9c9c9c;
        }
        &.left-img-col {
          width: 720px;
          margin-right: 30px;
          .img-stream {
            height: 526px;
          }
        }
        &.middle-img-col {
          position: relative;
          height: 1082px;
          width: 598px;
          margin-right: 30px;
          padding: 66px 60px 60px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 18px;
          .img-stream {
            padding: 0;
            border-radius: 12px;
          }
        }
        &.right-img-col {
          width: 520px;
          position: relative;
          .result.img-stream {
            height: 526px;
          }
          .img-stream {
            height: 352px;
          }
          .msg {
            position: relative;
            border: 0;
            padding: 66px 60px 60px;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 18px;
            height: 144px;
            width: 100%;
          }
        }
      }
    }
</style>