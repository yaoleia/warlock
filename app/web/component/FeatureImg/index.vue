<script>
    export default {
        data() {
            return {
                imgClass: 'el-icon-loading',
                observer: null
            }
        },
        props: {
            src: {
                type: String,
                required: true
            },
            cover: {
                required: false
            },
            noListen: {
                required: false
            },
            Position: {
                required: false
            }
        },
        async mounted() {
            if (!this.noListen) {
                // $(window).on(`resize.${this._uid}`, () => {
                //     if (!this.imgClass) {
                //         this.onImgLoad();
                //     }
                // })
            }
        },
        activated() {
            this.onImgLoad();
        },
        beforeDestroy() {
            if (!this.noListen) {
                // $(window).off(`resize.${this._uid}`);
            }
        },
        methods: {
            onImgLoad() {
                this.imgClass = '';
                const container = this.$el;
                const $imgWrap = $(this.$refs.imgWrap);
                const img = this.$refs.img;
                const containerRate = container.clientWidth / container.clientHeight;
                let faceObj;
                if (this.Position) {
                    faceObj = this.Position;
                }
                try {
                    const hh = container.clientHeight / img.naturalHeight;
                    const ww = container.clientWidth / img.naturalWidth;
                    const imgRate = img.naturalWidth / img.naturalHeight;
                    if (containerRate > imgRate) {
                        $imgWrap.css({ transform: `translate(-50%, -50%) scale(${this.cover ? ww : hh})` })
                        if (faceObj && this.cover) {
                            const faceAreaH = (faceObj.Y + faceObj.Height) * ww; // 图片方框底边高度
                            const imgH = img.naturalHeight * ww; // 显示的图片高度
                            const hb = (container.clientHeight + imgH) / 2;
                            const ht = (imgH - container.clientHeight) / 2;
                            if (faceAreaH > hb - 2) {
                                // $imgWrap.css({ top: `${img.naturalHeight * 0.5 * (ww - 1) - (faceAreaH - container.clientHeight + 2)}px`, left: "50%" })
                                $imgWrap.css({ top: `calc(50% + ${(imgH - container.clientHeight) * 0.5 - (faceAreaH - container.clientHeight + 2)}px)`, left: '50%' })
                            } else if (faceObj.Y * ww < ht) {
                                $imgWrap.css({ top: `calc(50% + ${(imgH - container.clientHeight) * 0.5 - (faceObj.Y * ww - 1)}px)`, left: '50%' })
                            }
                        }
                    } else {
                        $imgWrap.css({ transform: `translate(-50%, -50%) scale(${this.cover ? hh : ww}) ` })
                        if (faceObj && this.cover) {
                            const faceAreaW = (faceObj.X + faceObj.Width) * hh;
                            const imgW = hh * img.naturalWidth;
                            const wr = (container.clientWidth + imgW) / 2;
                            const wl = (imgW - container.clientWidth) / 2;
                            if (faceAreaW > wr) {
                                $imgWrap.css({ left: `calc(50% + ${(imgW - container.clientWidth) * 0.5 - (faceAreaW - container.clientWidth + 1)}px)`, top: '50%' })
                            } else if (faceObj.X * hh < wl) {
                                $imgWrap.css({ left: `calc(50% + ${(imgW - container.clientWidth) * 0.5 - (faceObj.X * hh - 1)}px)`, top: '50%' })
                            }
                        }
                    }
                    $imgWrap.show();
                    if (faceObj) {
                        const $area = $(this.$refs.faceArea);
                        $area.css({ width: faceObj.Width, height: faceObj.Height, top: faceObj.Y, left: faceObj.X })
                        $area.fadeIn(200, function() {
                            setTimeout(() => {
                                $area.fadeOut(200);
                            }, 800)
                        });
                    }
                } catch (error) {
                    // console.log(error);
                    // console.log(this.src);
                }
            },
            onError() {
                this.imgClass = 'el-icon-error';
            },
            altClick(e) {
                const img = e.target
                const src = img.src
                const evObj = document.createEvent('MouseEvents');
                const nameStartIndex = src.lastIndexOf('/');
                const downloadName = src.slice(nameStartIndex + 1) + '.jpg';
                const $a = document.createElement('a');
                $a.setAttribute('href', src);
                $a.setAttribute('download', downloadName);
                evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
                $a.dispatchEvent(evObj);
            }
        },
        watch: {
            src() {
                this.imgClass = 'el-icon-loading';
                $(this.$refs.faceArea).hide();
                $(this.$refs.imgWrap).css({ top: '50%', left: '50%' });
            }
        }
    }
</script>
<template>
    <div class="feature-img-container">
        <div class="icon" :class="imgClass"></div>
        <slot />
        <div class="img-wrap" ref="imgWrap">
            <img ref="img" class="img" :src="src" @click.alt.exact.stop="altClick" @load="onImgLoad" @error="onError" />
            <div class="face-area" ref="faceArea"></div>
        </div>
    </div>
</template>
<style lang="scss">
    .feature-img-container {
        position: relative;
        overflow: hidden;
        .icon {
            position: absolute;
            color: #444;
            font-size: 25px;
            width: 25px;
            height: 25px;
            display: none;
            &.el-icon-loading,
            &.el-icon-error {
                display: block;
            }
            &.el-icon-loading + .img-wrap,
            &.el-icon-error + .img-wrap {
                display: none;
            }
        }
        .img-wrap {
            display: none;
            position: absolute;
            transition: all 0.1;
            .face-area {
                display: none;
                position: absolute;
                box-shadow: 0 0 0 1px red;
            }
        }
        .img-wrap {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .icon {
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
        }
        .img {
            height: auto;
            width: auto;
        }
    }
</style>