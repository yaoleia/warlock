<script type="text/babel">
    import $ from "jquery"
    export default {
      data() {
        return {
          mouse: {},
          canMove: false,
          canI: false,
          timer: null,
          cut: {
            height: 100,
            width: 100,
            left: 0,
            top: 0
          }
        }
      },
      props: {
        imgMagnifier: {
          required: false
        }
      },
      methods: {
        close() {
          $(this.$refs.area).addClass("visibilityh")
          $(".img", this.$el).removeClass("filter")
          this.$nextTick(() => {
            this.imgMagnifier.cutBase64 = ""
          })
        },
        mousedown(e) {
          let $el = this.$el
          let $area = this.$refs.area
          let $areaw = $area.clientWidth
          let $areah = $area.clientHeight
          let $eltop = $($el).offset().top
          let $elleft = $($el).offset().left
          let $elw = $el.clientWidth
          let $elh = $el.clientHeight
          this.mouse = { e, $areaw, $areah, $eltop, $elleft, $elw, $elh, $area }
          this.canMove = true
          $(this.$refs.area)
            .removeClass("visibilityh")
            .css({
              backgroundSize: `${$elw}px ${$elh}px`
            })
          $(".img", this.$el).addClass("filter")
          this.move()
        },
        mousemove(e) {
          if (!this.canMove) return
          this.mouse.e = e
          this.move()
        },
        move() {
          let { e, $areaw, $areah, $eltop, $elleft, $elw, $elh, $area } = this.mouse
          let t = e.clientY - $eltop
          let l = e.clientX - $elleft
          let left = l - 0.5 * $areaw
          let top = t - 0.5 * $areah
          if (left < 0) {
            left = 0
          }
          if (left > $elw - $areaw) {
            left = $elw - $areaw
          }
          if (top < 0) {
            top = 0
          }
          if (top > $elh - $areah) {
            top = $elh - $areah
          }
          $($area).css({
            backgroundPosition: `-${left}px -${top}px`,
            left,
            top
          })
        },
        getArea() {
          let $area = this.$refs.area
          let left = $area.offsetLeft
          let top = $area.offsetTop
          let width = $area.clientWidth
          let height = $area.clientHeight
          this.cut = { left, top, width, height }
          this.cutPic(this.cut)
        },
        async cutPic(opt) {
          let img = $(".img-big .img", this.$el)[0]
          let scaleX = img.naturalWidth / img.clientWidth
          let scaleY = img.naturalHeight / img.clientHeight
          let base64 = await this.cutImg(
            img.src,
            opt.left * scaleX,
            opt.top * scaleY,
            opt.width * scaleX,
            opt.height * scaleY
          )
          this.imgMagnifier.cutBase64 = base64
        },
        cutImg(imgsrc, x, y, width, height, cutImgType) {
          cutImgType = cutImgType || "image/jpeg"
          return new Promise((resolve, reject) => {
            let img = new Image()
            img.onload = e => {
              try {
                var canvas = document.createElement("canvas")
                var ctx = canvas.getContext("2d")
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0)
                var imgData = ctx.getImageData(x, y, width, height)

                var canvas2 = document.createElement("canvas")
                canvas2.width = width
                canvas2.height = height
                var ctx2 = canvas2.getContext("2d")
                // 设置新的图片
                ctx2.putImageData(imgData, 0, 0)

                // 转换图片
                var fullQuality = canvas2.toDataURL("image/jpeg", 1.0)
                resolve(fullQuality)
              } catch (e) {
                reject(e)
              } finally {
                img = null
              }
            }
            img.onerror = e => {
              reject(e)
              img = null
            }
            img.src = imgsrc
          })
        },
        imousedown(e) {
          document.onmousemove = ev => {
            this.imousemove(ev)
            ev.preventDefault()
          }
          document.onmouseup = () => {
            document.onmousemove = null
            this.getArea()
            document.onmouseup = null
          }
        },
        imousemove(e) {
          let down = this.mouse
          let X = e.clientY - down.$eltop - this.cut.top - this.cut.height
          let Y = e.clientX - down.$elleft - this.cut.left - this.cut.width
          let value = Math.max(X, Y)
          let areaW = this.$refs.area.clientWidth
          let areaH = this.$refs.area.clientHeight

          let wh

          if (areaW + value < 30 || areaH + value < 30) {
            wh = 30
          } else {
            wh = areaW + value
          }

          if (areaH + value > down.$elh - this.cut.top) {
            wh = down.$elh - this.cut.top
          }
          if (areaW + value > down.$elw - this.cut.left) {
            wh = down.$elw - this.cut.left
          }

          $(this.$refs.area).css({ width: wh, height: wh })
          this.cut.width = wh
          this.cut.height = wh
        }
      },
      mounted() {
        if (this.imgMagnifier) {
          let path = this.imgMagnifier.sem_diff_path
          if (path) {
            this.$refs.area.style.backgroundImage = `url(${path})`
          }
        }
      },
      watch: {
        "mouse.e": async function(e) {
          if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
          }
          this.timer = setTimeout(() => {
            this.getArea()
            this.timer = null
          }, 15)
        },
        imgMagnifier(i) {
          this.$refs.area.style.backgroundImage = `url(${i.sem_diff_path})`
        }
      }
    }
</script>
<template>
    <div class="magnifier" @mousedown.prevent="mousedown" @mousemove.prevent="mousemove" @mouseup="canMove=false" @mouseleave="canMove=false">
        <slot></slot>
        <div class="area visibilityh" ref="area">
            <div class="close el-icon-close" @mousedown.stop @click.stop="close"></div>
            <i @mousedown.prevent.stop="imousedown"></i>
        </div>
    </div>
</template>
<style lang='scss'>
    .magnifier {
      width: 100%;
      height: 100%;
      position: relative;
      cursor: pointer;
      .img-big {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
      .img {
        pointer-events: none;
      }
      .filter {
        filter: grayscale(30%) brightness(70%);
      }
      .area {
        box-shadow: 0 0 0 1px #ccc;
        position: absolute;
        left: 0;
        top: 0;
        width: 100px;
        height: 100px;
        border-radius: 2px;
        background-color: rgba(0, 0, 235, 0.2);
        background-repeat: no-repeat;
        filter: brightness(110%);
        // transition: width 0.1s, height 0.1s;
        & > i {
          position: absolute;
          right: -10px;
          bottom: -10px;
          width: 24px;
          height: 24px;
          cursor: nwse-resize;
        }
      }
      .close {
        color: #ccc;
        opacity: 0.7;
        position: absolute;
        background: none;
        right: 0;
        top: 0;
        border: none;
        padding: 0;
        transition: all 0.3s;
      }
      .close:hover {
        opacity: 1;
        font-size: 20px;
      }
      .visibilityh {
        visibility: hidden;
      }
    }
</style>
