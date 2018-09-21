<script>
    import Webcam from "webcamjs"
    export default {
      data() {
        return {
          ready: false,
          camError: null
        }
      },
      props: {
        opts: {
          type: Object,
          required: false,
          default: null
        },
        id: {
          type: String,
          required: false,
          default() {
            return "webcam_" + this._uid
          }
        }
      },
      computed: {
        options() {
          const defaultOpts = {
            width: 420,
            height: 315,
            dest_width: 420,
            dest_height: 315,
            crop_width: 420,
            crop_height: 280,
            image_format: "jpeg",
            jpeg_quality: 90,
            flip_horiz: false,
            swfURL: "./public/lib/webcam.swf"
          }
          return { ...defaultOpts, ...this.opts }
        }
      },
      mounted() {
        this.init()
      },
      beforeDestroy() {
        this.uninit()
      },
      watch: {
        options() {
          this.uninit()
          this.init()
        }
      },
      methods: {
        init() {
          Webcam.reset()
          Webcam.set(this.options)
          Webcam.on("live", () => {
            this.ready = true
            this.$emit("ready")
          })
          Webcam.on("error", err => {
            this.camError = err
          })
          Webcam.attach("#" + this.id)
        },
        uninit() {
          this.ready = false
          this.camError = null
          Webcam.reset()
        },
        takeSnapshot() {
          return new Promise((resolve, reject) => {
            if (!this.ready) {
              reject()
            }
            const timestamp = moment().valueOf()
            Webcam.snap(uri => {
              resolve({ uri, timestamp })
            })
          })
        }
      }
    }
</script>
<template>
    <div class="webcam rel ovh tr">
        <div :id="id"></div>
        <p class="tc pct100" v-if="camError">暂无监控画面，请检查摄像头是否连接。</p>
    </div>
</template>
<style lang="scss" scoped>
    .webcam {
      display: flex;
      align-items: center;
      background: #999;
      > div {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
    }
</style>