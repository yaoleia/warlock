<template>
    <el-card class="img-stream big-area">
        <div slot="header">
            <p class="title" v-if="title">{{title}}</p>
        </div>
        <div class="big-area-box" ref="bigAreaBox"></div>
        <img :src="opt.cutBase64" v-if="opt.cutBase64" class="big-area-img" @load="loaded" :class="{visibility:!show}">
  </el-card>
</template>
<style lang="scss">
    .big-area {
    	box-sizing: border-box;
    	position: relative;
    	width: 100%;
    	height: 100%;
    	&.el-card {
    		border: none;
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
    	.big-area-box,
    	.big-area-img {
    		background-repeat: no-repeat;
    		position: absolute;
    		left: 0;
    		top: 0;
    		width: 100%;
    		height: 100%;
    		vertical-align: top;
    	}
    	.visibility {
    		visibility: hidden;
    	}
    }
</style>
<script type="text/babel">
    export default {
        data() {
            return {
                show: false,
                try: 2
            };
        },
        props: ["opt", "title"],
        mounted() { },
        methods: {
            loaded() {
                this.show = true
            }
        },
        watch: {
            "opt.cut": function (cut) {
                let bigAreaBox = this.$refs.bigAreaBox;
                if (!cut.width) {
                    bigAreaBox.style.cssText = "";
                    return;
                }
                let bigW = bigAreaBox.clientWidth
                let bigH = bigAreaBox.clientHeight
                let rateW = bigW / cut.width
                let rateH = bigH / cut.height
                bigAreaBox.style.cssText = `background-image: url(${this.opt.reg_img_path}); background-size: ${cut.sizeW * rateW}px ${cut.sizeH * rateH}px; background-position: -${cut.left * rateW}px -${cut.top * rateH}px;`
            }
        }
    };
</script>