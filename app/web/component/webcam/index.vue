<script>
    export default {
        data() {
            return {
                ready: false,
                camError: null,
                timer: null
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
                required: false,
                default: 300
            },
            height: {
                required: false,
                default: 300
            }
        },
        computed: {
            options() {
                const defaultOpts = {
                    width: 600,
                    height: 400,
                    dest_width: 600,
                    dest_height: 450,
                    image_format: 'jpeg',
                    jpeg_quality: 90,
                    flip_horiz: false,
                    swfURL: './public/webcam/webcam.swf'
                }
                const o = { ...defaultOpts, ...this.opts };
                o.width = this.width;
                o.height = this.height;
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
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.uninit();
                this.timer = setTimeout(() => {
                    this.init();
                }, 500);
            }
        },
        methods: {
            init() {
                import('webcamjs').then(Webcam => {
                    this.Webcam = Webcam;
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
                })
            },
            uninit() {
                if (this.Webcam) {
                    this.Webcam.reset()
                }
                this.ready = false
                this.camError = null
                this.Webcam = null
            },
            takeSnapshot() {
                return new Promise((resolve, reject) => {
                    if (!this.ready) {
                        reject()
                    }
                    const timestamp = new Date().getTime();
                    this.Webcam.snap(uri => {
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