<template>
    <div class="magnifier" @mousedown="mousedown" @mousemove="mousemove" @mouseup="canMove=false" @mouseleave="canMove=false">
        <slot></slot>
        <div class="area" ref="area">
            <i @mousedown.stop="imousedown"></i>
        </div>
    </div>
</template>
<style lang='scss'>
    .magnifier {
      width: 100%;
      height: 100%;
      position: relative;
      cursor: pointer;
      .img {
        pointer-events: none;
      }
      .area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100px;
        height: 100px;
        background: blue;
        opacity: 0.2;
        visibility: hidden;
        i {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 10px;
          height: 10px;
          background: #000;
          cursor: nwse-resize;
        }
      }
    }
</style>
<script type="text/babel">
    import $ from "jquery"
    export default {
      data() {
        return {
          mouse: {},
          canMove: false,
          timer: null,
          canI: false,
          imouse: {},
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
          $area.style.visibility = `visible`
          this.move()
        },
        mousemove(e) {
          if (!this.canMove) return
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.mouse.e = e
            this.move()
            this.timer = null
          }, 10)
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
          $area.style.left = `${left}px`
          $area.style.top = `${top}px`
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
          let img = $(".img", this.$el)[0]
          let scaleX = img.naturalWidth / img.clientWidth
          let scaleY = img.naturalHeight / img.clientHeight
          let src = await this.cutImg(
            img.src,
            opt.left * scaleX,
            opt.top * scaleY,
            opt.width * scaleX,
            opt.height * scaleY
          )
          this.imgMagnifier.src = src
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
          this.imouse.e = e
          document.onmousemove = ev => {
            this.imousemove(ev)
          }
          document.onmouseup = () => {
            document.onmousemove = null
          }
        },
        imousemove(e) {
          let downE = this.imouse.e
          let down = this.mouse
          let X = e.clientY - downE.clientY
          let Y = e.clientX - downE.clientX
          let value
          if (X > 0 || Y > 0) {
            value = Math.max(X, Y)
          } else {
            value = Math.min(X, Y)
          }
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

          this.$refs.area.style.width = `${wh}px`
          this.$refs.area.style.height = `${wh}px`
          this.cut.width = wh
          this.cut.height = wh
          this.imouse.e = e
        }
      },
      mounted() {},
      watch: {
        "mouse.e": async function(e) {
          this.getArea()
        }
      }
    }
</script>
