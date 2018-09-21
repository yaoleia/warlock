<script type="text/babel">
    import imgStream from "component/imgStream"
    import magnifier from "component/magnifier"
    export default {
      data() {
        return {
          imgMagnifier: {
            src: ""
          },
          opts: {},
          msg: {}
        }
      },
      computed: {
        serverUrl() {
          return this.$store.state.serverUrl
        },
        ifOk() {
          let type = this.msg.defect_type
          if (type) {
            return "NG"
          }
          if (type === 0) {
            return "OK"
          }
          return ""
        },
        defectType() {
          let type = this.msg.defect_type
          if (type === 0) {
            return "无缺陷"
          }
          if (type === 1) {
            return "多螺丝"
          }
          if (type === 2) {
            return "少螺丝"
          }
          return ""
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
        let self = this
        window.onresize = () => {
          this.resize()
        }
        this.$nextTick(() => {
          window.ws.emit("chat", "get")
          window.ws.on("msg", m => {
            self.msg = m
          })
        })
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
            <imgStream class="" title="目标定位" :url="msg.seg_img_path?`/img/${msg.seg_img_path}`:''"></imgStream>
        </div>
        <div class="middle-img-col col">
            <p class="title">检测结果</p>
            <magnifier :imgMagnifier="imgMagnifier" :pic="msg.sem_diff_path?`/img/${msg.sem_diff_path}`:''">
                <img class="img-big" :src="`/img/2.jpg`">
                <imgStream :url="msg.sem_diff_path?`/img/${msg.sem_diff_path}`:''"></imgStream>
            </magnifier>
        </div>
        <div class="right-img-col col">
            <imgStream class="result mb30" title="局部放大" :url="imgMagnifier.src"></imgStream>
            <!-- <el-card class="img-stream">
                <webcam :opts="opts"></webcam>
            </el-card> -->
            <el-card class="msg mb30">
                <p class="title">检测结果详情</p>
                <span>{{msg.dm_code}}</span><br>
                <span>{{ifOk}}</span>
                <span>{{defectType}}</span>
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
          .img-big {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: -2;
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
            padding: 66px 60px 0;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 18px;
            height: 144px;
            width: 100%;
            .el-card__body {
              padding: 0;
              color: #dbdbdb;
              font-size: 15px;
              line-height: 24px;
              padding-left: 5px;
              span {
                margin: 0 30px 0 0;
              }
            }
          }
        }
      }
    }
</style>