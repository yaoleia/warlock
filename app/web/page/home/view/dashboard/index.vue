<script type="text/babel">
    import imgStream from "component/imgStream"
    import magnifier from "component/magnifier"
    import bigArea from "component/magnifier/bigArea"
    import utils from "framework/utils"
    import $ from "jquery"
    export default {
        data() {
            return {
                productList: [],
                opts: {},
                curProduct: {
                    cutBase64: "",
                    cut: {}
                },
                tagRadio: "1",
                switchCraft: true
            }
        },
        computed: {
            serverUrl() {
                return this.$store.state.serverUrl
            },
            ifOk() {
                let type = this.curProduct.defect_type
                return utils.ifOk(type)
            },
            defectType() {
                let type = this.curProduct.defect_type
                return utils.defectType(type)
            }
        },
        beforeMount() {
            // 只会在浏览器执行
            // this.$options.components.webcam = () => import("component/webcam")
        },
        methods: {
            resize() {
                if (window.innerWidth < 1440) {
                    this.opts = {
                        width: 320,
                        height: 240,
                        dest_width: 320,
                        dest_height: 240,
                        crop_width: 320,
                        crop_height: 213
                    }
                } else {
                    this.opts = {}
                }
            },
            getWsMsg() {
                if (window.ws.connected) {
                    this.emitChat()
                } else {
                    window.ws.on("connect", () => {
                        this.emitChat()
                    })
                }
            },
            controlWs() {
                this.switchCraft = !this.switchCraft;
                if (this.switchCraft) {
                    this.emitChat();
                } else {
                    window.ws.off("msg");
                }
            },
            emitChat() {
                // let $imgMagnifier = $(".middle-img-col .img-stream:not(.img-big)", this.$el)
                window.ws.off("msg").emit("chat", "get").on("msg", m => {
                    this.curProduct = { ...this.curProduct, ...m }
                    console.log(m)
                    // $imgMagnifier.stop().fadeOut(200).fadeIn(200)
                })
            }
        },
        activated() {
            // this.resize()
            // window.onresize = () => {
            //   this.resize()
            // }
            // let video = document.querySelectorAll("video")[0]
            // if (video) {
            //   video.play()
            // }
            this.$nextTick(() => {
                if (this.switchCraft) {
                    this.getWsMsg()
                }
            })
        },
        components: {
            imgStream,
            magnifier,
            bigArea
        }
    }
</script>
<template>
    <div class="dashboard">
        <div class="left-img-col col">
            <imgStream class="mb30" title="拍摄原图" :url="`${serverUrl}/detect/video_feed_main`"></imgStream>
            <imgStream title="目标定位" :url="curProduct.seg_img_path"></imgStream>
        </div>
        <div class="middle-img-col col">
            <p class="title">检测结果 <el-button type="text" class="control-btn" @click="controlWs">{{switchCraft?"暂停":"开始"}}</el-button>
            </p>
            <!-- <el-radio-group v-model="tagRadio" size="small">
                <el-radio-button label="1">原图</el-radio-button>
                <el-radio-button label="2">标记</el-radio-button>
            </el-radio-group> -->
            <magnifier :imgMagnifier="curProduct">
                <imgStream class="img-big" v-if="curProduct.reg_img_path" :url="curProduct.reg_img_path"></imgStream>
                <imgStream :url="curProduct.mask_img_path"></imgStream>
            </magnifier>
        </div>
        <div class="right-img-col col">
            <big-area class="result mb30" title="局部放大" :opt="curProduct"></big-area>
            <!-- <el-card class="img-stream">
                <webcam :opts="opts"></webcam>
            </el-card> -->
            <el-card class="msg mb30">
                <p class="title">检测结果详情</p>
                <span>{{curProduct.dm_code}}</span><br>
                <span>{{ifOk}}</span>
                <span>{{defectType}}</span>
            </el-card>
            <imgStream title="监控" :url="`${serverUrl}/detect/video_feed_usb`"></imgStream>
        </div>
    </div>
</template>
<style lang="less">
    ::selection {
    	background: transparent;
    }
    .dashboard {
    	box-sizing: border-box;
    	height: 100%;
    	display: table;
    	margin: 0 auto;
    	min-width: 1900px;
    	.col {
    		float: left;
    		display: flex;
    		flex-direction: column;
    		align-items: center;
    		justify-content: space-between;
    		.mb30 {
    			margin-bottom: 30px;
    		}
    		.img-stream {
    			background: rgba(255, 255, 255, 0.06);
    			border-radius: 18px;
    			padding: 66px 60px 60px;
    			.el-card__body {
    				border-radius: 12px;
    				overflow: hidden;
    			}
    		}
    		p.title {
    			font-size: 24px;
    			line-height: 66px;
    			position: absolute;
    			left: 60px;
    			top: 0;
    			color: #9c9c9c;
    		}
    		&.left-img-col {
    			width: 720px;
    			margin-right: 30px;
    			.img-stream {
    				height: 526px;
    			}
    		}
    		&.middle-img-col {
    			position: relative;
    			height: 1082px;
    			width: 598px;
    			margin-right: 30px;
    			padding: 66px 60px 60px;
    			background: rgba(255, 255, 255, 0.06);
    			border-radius: 18px;
    			.control-btn {
    				color: #9c9c9c;
    				padding-left: 30px;
    			}
    			.el-button--text:hover {
    				color: #ff8800;
    			}
    			.img-stream {
    				padding: 0;
    				border-radius: 12px;
    				background: none;
    				box-shadow: none;
    			}
    		}
    		&.right-img-col {
    			width: 520px;
    			position: relative;
    			.result.img-stream {
    				height: 526px;
    			}
    			.img-stream {
    				height: 352px;
    			}
    			.msg {
    				position: relative;
    				border: 0;
    				padding: 66px 60px 0;
    				background: rgba(255, 255, 255, 0.06);
    				border-radius: 18px;
    				height: 144px;
    				width: 100%;
    				.el-card__body {
    					padding: 0;
    					color: #dbdbdb;
    					font-size: 15px;
    					line-height: 24px;
    					padding-left: 5px;
    					span {
    						margin: 0 30px 0 0;
    					}
    				}
    			}
    		}
    	}
    }
</style>