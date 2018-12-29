<template>
    <el-card class="big-area">
        <div slot="header">
            <p class="title" v-if="title">{{title}}</p>
        </div>
        <transition name="el-fade-in">
            <div v-show="showTemplate" class="big-area-template" ref="bigAreaTemplate"></div>
        </transition>
        <div class="big-area-box" ref="bigAreaBox"></div>
        <img :src="opt.cutBase64" v-if="opt.cutBase64" class="big-area-img" @load="loaded" :class="{visibility:!show}">
        <el-button :class="primaryBtn" type="text" title="查看模板" class="show-temp" icon="el-icon-view" @click="showTemp"></el-button>
    </el-card>
</template>
<script type="text/babel">
    export default {
        data() {
            return {
                timer: null,
                timer2: null,
                showTemplate: false,
                show: false,
                primaryBtn: ''
            };
        },
        props: ['opt', 'title'],
        mounted() { },
        methods: {
            loaded() {
                this.show = true
            },
            showTemp() {
                this.clearTimer();
                this.showTemplate = !this.showTemplate;
            },
            clearTimer() {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null
                }
                if (this.timer2) {
                    clearTimeout(this.timer2);
                    this.timer2 = null
                }
            }
        },
        watch: {
            showTemplate(t) {
                this.primaryBtn = t ? 'primary' : '';
            },
            'opt.cut': function(cut) {
                this.showTemplate = false;
                if (!cut.width) return;
                const bigAreaBox = this.$refs.bigAreaBox;
                const bigAreaTemplate = this.$refs.bigAreaTemplate;
                const bigW = bigAreaBox.clientWidth
                const bigH = bigAreaBox.clientHeight
                const rateW = bigW / cut.width
                const rateH = bigH / cut.height
                Object.assign(bigAreaBox.style, {
                    backgroundImage: `url(${this.opt.reg_img_path})`,
                    backgroundSize: `${cut.sizeW * rateW}px ${cut.sizeH * rateH}px`,
                    backgroundPosition: `-${cut.left * rateW}px -${cut.top * rateH}px`
                })
                Object.assign(bigAreaTemplate.style, {
                    backgroundSize: `${cut.sizeW * rateW}px ${cut.sizeH * rateH}px`,
                    backgroundPosition: `-${cut.left * rateW}px -${cut.top * rateH}px`
                })
                this.clearTimer();
                this.timer = setTimeout(() => {
                    this.showTemplate = true;
                    this.timer2 = setTimeout(() => {
                        this.showTemplate = false;
                    }, 2000)
                }, 2000);
            }
        }
    };
</script>
<style lang="scss">
    .big-area {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 100%;
        &.el-card {
            border: none;
            overflow: initial;
        }
        .el-card__header {
            border: none;
            padding: 0;
        }
        .el-card__body {
            padding: 0;
            height: 100%;
            position: relative;
        }
        .big-area-template,
        .big-area-box,
        .big-area-img {
            background-repeat: no-repeat;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            vertical-align: top;
            z-index: 100;
            border-radius: 10px;
        }
        .show-temp {
            background-color: transparent;
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 200;
            padding: 10px;
            &.primary {
                > i {
                    color: #ff8800;
                }
            }
            > i {
                font-size: 24px;
                color: #373737;
                text-shadow: 4px 6px 7px #000;
            }
        }
        .big-area-template {
            background-image: url("/public/mock-img/template_img.jpg");
            z-index: 110;
        }
        .visibility {
            visibility: hidden;
        }
    }
</style>