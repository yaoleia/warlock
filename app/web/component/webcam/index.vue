<script>
    export default {
        data() {
            return {
                timer: null,
                constraints: null,
                mediaRecorder: null
            }
        },
        props: {
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

        },
        mounted() {
            if (window.location.hostname === '127.0.0.1') {
                this.init()
            } else {
                const mediaSource = new MediaSource();
                this.mediaSource = mediaSource
                this.queue = [];
                const video = this.$refs.video;
                video.src = window.URL.createObjectURL(mediaSource);
                mediaSource.addEventListener('sourceopen', (e) => {
                    video.play();
                    this.buffer = mediaSource.addSourceBuffer('video/webm;codecs=vp8');
                    this.buffer.addEventListener('update', (_) => {
                        if (this.queue.length > 0 && !this.buffer.updating) {
                            this.buffer.appendBuffer(this.queue.shift());
                        }
                    });
                    // this.buffer.addEventListener('updateend', (_) => {
                    //     if (!this.buffer.updating && mediaSource.readyState === 'open') {
                    //         mediaSource.endOfStream();
                    //         // 在数据请求完成后，我们需要调用 endOfStream()。它会改变 MediaSource.readyState 为 ended 并且触发 sourceended 事件。
                    //         video.play().then(function () { }).catch(function (err) {
                    //             console.log(err)
                    //         });
                    //     }
                    // });


                    if (window.ws.connected) {
                        this.emitVideo()
                    } else {
                        window.ws.on('connect', () => {
                            this.emitVideo()
                        })
                    }
                })
            }
        },
        beforeDestroy() {
            this.uninit()
        },
        watch: {

        },
        methods: {
            emitVideo() {
                this.chunks = [];
                window.ws.on('video', data => {
                    if (this.buffer.updating || this.queue.length > 0) {
                        this.queue.push(new Uint8Array(data));
                    } else {
                        this.buffer.appendBuffer(new Uint8Array(data));
                    }
                })
            },
            init() {
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                this.chunks = [];
                this.$refs.video.controls = false;
                if (this.getBrowser() == 'Chrome') {
                    this.constraints = {
                        audio: false,
                        video: {
                            mandatory: {
                                minWidth: 640,
                                maxWidth: 640,
                                minHeight: 480,
                                maxHeight: 480
                            },
                            optional: []
                        }
                    };// Chrome
                } else if (this.getBrowser() == 'Firefox') {
                    this.constraints = {
                        audio: false,
                        video: {
                            width: {
                                min: 640,
                                ideal: 640,
                                max: 640
                            },
                            height: {
                                min: 480,
                                ideal: 480,
                                max: 480
                            }
                        }
                    }; // Firefox
                }
                if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
                    console.log('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
                } else {
                    navigator.getUserMedia(this.constraints, this.startRecording, this.errorCallback);
                }
            },
            uninit() {
                if (this.mediaRecorder) {
                    const tracks = this.stream.getTracks();
                    tracks.map(t => t.stop());
                    this.mediaRecorder.stop();
                    this.$refs.video.controls = true;
                } else {
                    const blob = new Blob(this.chunks, {
                        type: 'video/webm'
                    });
                    const videoURL = window.URL.createObjectURL(blob);
                    this.$refs.video.src = videoURL;
                    this.$refs.video.play();
                }
            },
            startRecording(stream) {
                this.stream = stream;
                console.log('Start recording...');
                let mediaRecorder = null;
                if (typeof MediaRecorder.isTypeSupported == 'function') {
                    /*
                     * MediaRecorder.isTypeSupported is a function announced in
                     * https://developers.google.com/web/updates/2016/01/mediarecorder and
                     * later introduced in the MediaRecorder API spec
                     * http://www.w3.org/TR/mediastream-recording/
                     */
                    let options = null;
                    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                        options = {
                            mimeType: 'video/webm;codecs=h264'
                        };
                    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
                        options = {
                            mimeType: 'video/webm;codecs=h264'
                        };
                    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
                        options = {
                            mimeType: 'video/webm;codecs=vp8'
                        };
                    }
                    options = {
                        mimeType: 'video/webm;codecs=vp8'
                    };
                    console.log('Using ' + options.mimeType);
                    mediaRecorder = new MediaRecorder(stream, options);
                } else {
                    console.log('isTypeSupported is not supported, using default codecs for browser');
                    mediaRecorder = new MediaRecorder(stream);
                }


                mediaRecorder.start(50);

                this.$refs.video.srcObject = stream;
                this.$refs.video.play();

                mediaRecorder.ondataavailable = (e) => {
                    // console.log('Data available...');
                    // console.log(e.data);
                    // console.log(e.data.type);
                    // console.log(e);
                    this.chunks.push(e.data);
                    window.ws.emit('video', e.data)
                    // const reader = new FileReader();
                    // reader.addEventListener('loadend', () => {
                    //     // reader.result 包含转化为类型数组的blob
                    //     if (reader.result.byteLength > 0) {
                    //         const buf = new Uint8Array(reader.result);
                    //         window.ws.emit('video', buf)
                    //     }
                    // });
                    // reader.readAsArrayBuffer(e.data);
                };

                mediaRecorder.onerror = (e) => {
                    console.log('Error: ' + e);
                    console.log('Error: ', e);
                };

                mediaRecorder.onstart = () => {
                    console.log('Started & state = ' + mediaRecorder.state);
                };

                mediaRecorder.onstop = () => {
                    console.log('Stopped  & state = ' + mediaRecorder.state);

                    const blob = new Blob(this.chunks, {
                        type: 'video/webm'
                    });
                    this.chunks = [];
                    const videoURL = window.URL.createObjectURL(blob);
                    if (this.$refs.video) {
                        this.$refs.video.srcObject = null;
                        this.$refs.video.src = videoURL;
                    }
                    if (this.$refs.downloadLink) {
                        this.$refs.downloadLink.href = videoURL;
                        this.$refs.downloadLink.innerHTML = 'Download video file';
                        const rand = Math.floor((Math.random() * 10000000));
                        const name = 'video_' + rand + '.webm';

                        this.$refs.downloadLink.setAttribute('download', name);
                        this.$refs.downloadLink.setAttribute('name', name);
                    }
                };

                mediaRecorder.onpause = () => {
                    console.log('Paused & state = ' + mediaRecorder.state);
                }

                mediaRecorder.onresume = () => {
                    console.log('Resumed  & state = ' + mediaRecorder.state);
                }

                mediaRecorder.onwarning = (e) => {
                    console.log('Warning: ' + e);
                };
                this.mediaRecorder = mediaRecorder;
            },
            errorCallback(error) {
                console.log('navigator.getUserMedia error: ', error);
            },
            getBrowser() {
                const nVer = navigator.appVersion;
                const nAgt = navigator.userAgent;
                let browserName = navigator.appName;
                let fullVersion = '' + parseFloat(navigator.appVersion);
                let majorVersion = parseInt(navigator.appVersion, 10);
                let nameOffset,
                    verOffset,
                    ix;

                // In Opera, the true version is after "Opera" or after "Version"
                if ((verOffset = nAgt.indexOf('Opera')) != -1) {
                    browserName = 'Opera';
                    fullVersion = nAgt.substring(verOffset + 6);
                    if ((verOffset = nAgt.indexOf('Version')) != -1) { fullVersion = nAgt.substring(verOffset + 8); }
                } else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
                    browserName = 'Microsoft Internet Explorer';
                    fullVersion = nAgt.substring(verOffset + 5);
                } else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
                    browserName = 'Chrome';
                    fullVersion = nAgt.substring(verOffset + 7);
                } else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
                    browserName = 'Safari';
                    fullVersion = nAgt.substring(verOffset + 7);
                    if ((verOffset = nAgt.indexOf('Version')) != -1) { fullVersion = nAgt.substring(verOffset + 8); }
                } else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
                    browserName = 'Firefox';
                    fullVersion = nAgt.substring(verOffset + 8);
                } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                    browserName = nAgt.substring(nameOffset, verOffset);
                    fullVersion = nAgt.substring(verOffset + 1);
                    if (browserName.toLowerCase() == browserName.toUpperCase()) {
                        browserName = navigator.appName;
                    }
                }
                // trim the fullVersion string at semicolon/space if present
                if ((ix = fullVersion.indexOf(';')) != -1) { fullVersion = fullVersion.substring(0, ix); }
                if ((ix = fullVersion.indexOf(' ')) != -1) { fullVersion = fullVersion.substring(0, ix); }

                majorVersion = parseInt('' + fullVersion, 10);
                if (isNaN(majorVersion)) {
                    fullVersion = '' + parseFloat(navigator.appVersion);
                    majorVersion = parseInt(navigator.appVersion, 10);
                }

                return browserName;
            }
        }
    }
</script>
<template>
    <div class="webcam">
        <div :id="id" @click="uninit">
            <video src="" ref="video"></video>
            <a href="" ref="downloadLink"></a>
        </div>
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
            width: 100%;
            height: 100%;
            video {
                width: 100%;
                height: 100%;
            }
        }
        .cam-error-text {
            width: 100%;
            text-align: center;
            color: #9c9c9c;
        }
    }
</style>