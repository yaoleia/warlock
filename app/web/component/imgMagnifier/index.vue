<script type="text/babel">
    import imgStream from 'component/imgStream'
    import bigArea from 'component/imgMagnifier/bigArea'
    export default {
        name: 'imgMagnifier',
        data() {
            return {
                mouse: {},
                canMove: false,
                canI: false,
                timer: null,
                timerCut: null,
                cutObj: {
                    cut: {},
                    cutBase64: ''
                }
            }
        },
        components: {
            imgStream,
            bigArea
        },
        props: {
            mask_img_path: {
                required: false
            },
            reg_img_path: {
                required: false
            },
            template_img: {
                required: false
            }
        },
        methods: {
            close(hand) {
                if (hand) {
                    this.$emit('close');
                }
                $(this.$refs.area).addClass('visibilityh')
                $('.img', this.$el).removeClass('filter')
                this.canMove = false;
                this.canI = false;
                setTimeout(() => {
                    this.cutObj.cutBase64 = '';
                    this.cutObj.cut = {};
                }, 13)
            },
            mousedown(e) {
                if (!this.reg_img_path) return;
                const $el = this.$el
                const $area = this.$refs.area
                const $areaw = $area.clientWidth
                const $areah = $area.clientHeight
                const $eltop = $($el).offset().top
                const $elleft = $($el).offset().left
                const $elw = $el.clientWidth
                const $elh = $el.clientHeight
                this.mouse = { e, $areaw, $areah, $eltop, $elleft, $elw, $elh, $area }
                this.canMove = true
                $(this.$refs.area)
                    .removeClass('visibilityh')
                    .css({
                        backgroundSize: `${$elw}px ${$elh}px`
                    })
                $('.img', this.$el).addClass('filter')
                this.cutObj.cut = { ...this.cutObj.cut, sizeW: $elw, sizeH: $elh }
                this.move()
            },
            mousemove(e) {
                if (!this.canMove) return
                this.mouse.e = e
                this.move()
            },
            move() {
                const { e, $areaw, $areah, $eltop, $elleft, $elw, $elh, $area } = this.mouse
                const t = e.clientY - $eltop
                const l = e.clientX - $elleft
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
                const $area = this.$refs.area
                const left = $area.offsetLeft
                const top = $area.offsetTop
                const width = $area.clientWidth
                const height = $area.clientHeight
                const cut = { left, top, width, height }
                this.cutObj.cut = { ...this.cutObj.cut, ...cut }
                this.cutObj.cutBase64 = ''
                // if (this.timerCut) {
                //     clearTimeout(this.timerCut)
                //     this.timerCut = null
                // }
                // this.timerCut = setTimeout(() => {
                //     this.cutPic(cut)
                //     this.timerCut = null;
                // }, 400);
            },
            async cutPic(opt) {
                const $img = $('.img-big .img', this.$el)[0]
                let img = new Image()
                img.onload = async e => {
                    const scaleX = img.naturalWidth / $img.clientWidth
                    const scaleY = img.naturalHeight / $img.clientHeight
                    const base64 = await this.cutImg(
                        img.src,
                        opt.left * scaleX,
                        opt.top * scaleY,
                        opt.width * scaleX,
                        opt.height * scaleY
                    )
                    this.cutObj.cutBase64 = base64
                    img = null;
                }
                img.onerror = e => {
                    img = null
                }
                img.src = `/api/proxyurl?url=${$img.src}`
            },
            cutImg(imgsrc, x, y, width, height, cutImgType) {
                cutImgType = cutImgType || 'image/jpeg'
                return new Promise((resolve, reject) => {
                    let img = new Image()
                    img.onload = e => {
                        try {
                            const canvas = document.createElement('canvas')
                            const ctx = canvas.getContext('2d')
                            canvas.width = img.width
                            canvas.height = img.height
                            ctx.drawImage(img, 0, 0)
                            const imgData = ctx.getImageData(x, y, width, height)

                            const canvas2 = document.createElement('canvas')
                            canvas2.width = width
                            canvas2.height = height
                            const ctx2 = canvas2.getContext('2d')
                            // 设置新的图片
                            ctx2.putImageData(imgData, 0, 0)

                            // 转换图片
                            const fullQuality = canvas2.toDataURL('image/jpeg', 1.0)
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
                this.canI = true;
                document.onmousemove = ev => {
                    if (!this.canI) return;
                    this.imousemove(ev)
                    ev.preventDefault()
                }
                document.onmouseup = () => {
                    document.onmousemove = null
                    if (this.canI) {
                        this.getArea()
                    }
                    this.canI = false;
                    document.onmouseup = null
                }
            },
            imousemove(e) {
                const down = this.mouse
                const cut = this.cutObj.cut;
                const X = e.clientY - down.$eltop - cut.top - cut.height
                const Y = e.clientX - down.$elleft - cut.left - cut.width
                const value = Math.max(X, Y)
                const areaW = this.$refs.area.clientWidth
                const areaH = this.$refs.area.clientHeight

                let wh

                if (areaW + value < 50 || areaH + value < 50) {
                    wh = 50
                } else {
                    wh = areaW + value
                }

                if (areaH + value > down.$elh - cut.top) {
                    wh = down.$elh - cut.top
                }
                if (areaW + value > down.$elw - cut.left) {
                    wh = down.$elw - cut.left
                }

                $(this.$refs.area).css({ width: wh, height: wh })
                this.cutObj.cut = { ...this.cutObj.cut, width: wh, height: wh }
                this.mouse = { ...this.mouse, $areah: wh, $areaw: wh }
            },
            showAnimateSetBackground() {
                if (this.mask_img_path) {
                    const path = this.mask_img_path
                    if (path) {
                        this.$refs.area.style.backgroundImage = `url(${path})`
                        const $imgMagnifier = $('.img-stream:not(.img-big)', this.$el)
                        $imgMagnifier.finish().fadeOut('fast').fadeIn();
                    }
                }
            }
        },
        mounted() {
            this.showAnimateSetBackground()
        },
        watch: {
            'mouse.e': async function(e) {
                if (this.timer) {
                    clearTimeout(this.timer)
                    this.timer = null
                }
                this.timer = setTimeout(() => {
                    this.getArea()
                    this.timer = null
                }, 13)
            },
            mask_img_path() {
                this.close();
                this.cutObj.cutBase64 = ''
                this.showAnimateSetBackground()
            },
            'cutObj.cut': function(c) {
                if (c.width) {
                    this.$emit('update:switchCraft', false)
                }
            },
        }
    }
</script>
<template>
    <div class="magnifier" @mousedown.prevent="mousedown" @mousemove.prevent="mousemove" @mouseup="canMove=false" @mouseleave="canMove=false">
        <img-stream :alwaysTry="true" class="img-big" v-if="reg_img_path" :url="reg_img_path"></img-stream>
        <img-stream :alwaysTry="true" :url="mask_img_path"></img-stream>
        <div class="area visibilityh" ref="area">
            <div class="close el-icon-close" @mousedown.stop @click.stop="close(true)"></div>
            <i @mousedown.prevent.stop="imousedown"></i>
        </div>
        <transition name="el-fade-in-linear">
            <big-area v-show="cutObj.cut.width" class="result" :template_img='template_img' :opt="cutObj" v-bind='$props' @mousedown.native.stop.prevent></big-area>
        </transition>
    </div>
</template>
<style lang='scss'>
    .magnifier {
        width: 100%;
        height: 100%;
        position: relative;
        .img-big {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }
        .img {
            cursor: pointer;
        }
        .filter {
            filter: grayscale(30%) brightness(70%);
        }
        .area {
            cursor: pointer;
            box-shadow: 0 0 0 1px #ccc;
            position: absolute;
            left: 0;
            top: 0;
            width: 240px;
            height: 240px;
            border-radius: 2px;
            background-color: rgba(0, 0, 235, 0.2);
            background-repeat: no-repeat;
            filter: brightness(110%);
            // transition: all 0.05s;
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
            font-size: 25px;
            color: #ccc;
            opacity: 0.7;
            position: absolute;
            background: none;
            right: 0;
            top: 0;
            border: none;
            padding: 5px;
            margin: -5px;
            transition: font-size 0.2s;
        }
        .close:hover {
            opacity: 1;
            font-size: 30px;
        }
        .visibilityh {
            visibility: hidden;
        }
    }
</style>
