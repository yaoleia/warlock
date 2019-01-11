<script>
    import Webcam from 'webcamjs'
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
                    return 'webcam_' + this._uid
                }
            },
            width: {
                required: false
            },
            height: {
                required: false
            }
        },
        computed: {
            options() {
                const defaultOpts = {
                    width: 600,
                    height: 400,
                    dest_width: 400,
                    dest_height: 300,
                    crop_width: 600,
                    crop_height: 450,
                    image_format: 'jpeg',
                    jpeg_quality: 90,
                    flip_horiz: false,
                    swfURL: './public/webcam/webcam.swf'
                }
                const o = { ...defaultOpts, ...this.opts };
                if (!this.width) {
                    return o;
                }
                const rate = this.width / this.height;
                o.width = this.width;
                o.height = this.height;
                if (rate > 420 / 315) {
                    o.crop_width = this.width;
                    o.crop_height = this.width * 315 / 420;
                } else {
                    o.crop_height = this.height;
                    o.crop_width = this.height * 420 / 315;
                }
                return o;
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
                Webcam.on('live', () => {
                    this.ready = true
                    this.$emit('ready')
                })
                Webcam.on('error', err => {
                    this.camError = err
                })
                Webcam.attach('#' + this.id)
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
                    const timestamp = new Date().getTime();
                    Webcam.snap(uri => {
                        resolve({ uri, timestamp })
                    })
                })
            }
        }
    }
</script>
<template>
    <div class="webcam">
        <div :id="id"></div>
        <p class="cam-error-text" v-if="camError">暂无监控画面，请检查摄像头是否连接。</p>
    </div>
</template>
<style lang="scss" scoped>
    .webcam {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        > div {
            position: absolute;
            top: 0;
            left: 0;
        }
        .cam-error-text {
            width: 100%;
            text-align: center;
            color: #9c9c9c;
        }
    }
</style>