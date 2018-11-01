<template>
    <el-card class="big-area">
        <div slot="header">
            <p class="title" v-if="title">{{title}}</p>
        </div>
        <div class="big-area-template" style="visibility: hidden;" ref="bigAreaTemplate"></div>
        <div class="big-area-box" ref="bigAreaBox"></div>
        <img :src="opt.cutBase64" v-if="opt.cutBase64" class="big-area-img" @load="loaded" :class="{visibility:!show}">
        <el-button :class="primaryBtn" type="text" title="查看模板" class="show-temp" icon="el-icon-refresh" @click="showTemp(showTemplate=!showTemplate)"></el-button>
    </el-card>
</template>
<script type="text/babel">
    export default {
        data() {
            return {
                show: false,
                try: 2,
                timer: null,
                showTemplate: false,
                primaryBtn: ''
            };
        },
        props: ["opt", "title"],
        mounted() { },
        methods: {
            loaded() {
                this.show = true
            },
            showTemp(bol) {
                let bigAreaBox = this.$refs.bigAreaBox;
                if (bol) {
                    clearTimeout(this.timer);
                    $(bigAreaBox).fadeOut();
                    return;
                }
                if (bol === false) {
                    clearTimeout(this.timer);
                    $(bigAreaBox).fadeIn();
                    return;
                }
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                let self = this;
                this.timer = setTimeout(() => {
                    self.showTemplate = true;
                    $(bigAreaBox).finish().fadeOut(1000, function () {
                        setTimeout(() => {
                            $(this).fadeIn(1000);
                            self.time = null;
                            self.showTemplate = false;
                        }, 1500);
                    })
                }, 2000);
            }
        },
        watch: {
            showTemplate(t) {
                this.primaryBtn = t ? 'primary' : '';
            },
            "opt.cut": function (cut) {
                this.showTemplate = false;
                let bigAreaBox = this.$refs.bigAreaBox;
                let bigAreaTemplate = this.$refs.bigAreaTemplate;
                if (!cut.width) {
                    bigAreaBox.style.cssText = "";
                    bigAreaTemplate.style.cssText = "visibility: hidden;";
                    return;
                }
                let bigW = bigAreaBox.clientWidth
                let bigH = bigAreaBox.clientHeight
                let rateW = bigW / cut.width
                let rateH = bigH / cut.height
                bigAreaBox.style.cssText = `background-image: url(${this.opt.reg_img_path}); background-size: ${cut.sizeW * rateW}px ${cut.sizeH * rateH}px; background-position: -${cut.left * rateW}px -${cut.top * rateH}px;`
                bigAreaTemplate.style.cssText = `background-size: ${cut.sizeW * rateW}px ${cut.sizeH * rateH}px; background-position: -${cut.left * rateW}px -${cut.top * rateH}px;`
                this.showTemp();
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
    		background: rgba($color: #373737, $alpha: 0.9);
    		background-color: transparent;
    		position: absolute;
    		bottom: -50px;
    		right: -10px;
    		z-index: 101;
    		padding: 10px;
    		box-shadow: 6px 6px 6px 0 #000;
    		&.primary {
    			> i {
    				color: #000;
    			}
    		}
    		> i {
    			font-size: 20px;
    			color: #ff8800;
    		}
    	}
    	.big-area-template {
    		background-image: url('/public/mock-img/template_img.jpg');
    		z-index: 10;
    	}
    	.visibility {
    		visibility: hidden;
    	}
    }
</style>