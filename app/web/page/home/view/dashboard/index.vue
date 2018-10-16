<script type="text/babel">
    import imgStream from "component/imgStream"
    import magnifier from "component/magnifier"
    import bigArea from "component/magnifier/bigArea"
    import utils from "framework/utils"
    let curObj = {
        cutBase64: "",
        defect_type: "",
        dm_code: "",
        mask_img_path: "",
        seg_img_path: "",
        reg_img_path: "",
        detect_time: "",
        dm_img_path: "",
        cut: {}
    }
    export default {
        data() {
            return {
                productList: [],
                opts: {},
                curProduct: { ...curObj },
                switchCraft: true,
                showSwitch: false
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
                    if (!this.showSwitch) this.showSwitch = true;
                } else {
                    window.ws.on("connect", () => {
                        if (!this.showSwitch) this.showSwitch = true;
                        this.emitChat()
                    })
                }
            },
            emitChat() {
                window.ws.off("msg").emit("chat", "get").on("msg", m => {
                    if (this.switchCraft) {
                        this.$refs.magnifier.close();
                        this.curProduct = { ...curObj, ...m }
                    }

                    if (m.defect_type != 0) {
                        // this.$notify({
                        //     title: `${m.dm_code}`,
                        //     customClass: "warlock-warning-notify",
                        //     dangerouslyUseHTMLString: true,
                        //     message: `<img src="${m.mask_img_path}">`,
                        //     type: "warning",
                        //     position: "bottom-right",
                        //     onClick() {
                        //         console.log(m)
                        //     }
                        // });
                    }
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
                this.getWsMsg()
            })
        },
        watch: {
            'curProduct.cut': function (c) {
                if (c.width) {
                    this.switchCraft = false;
                }
            }
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
            <p class="title">
                <span>检测结果</span>
                <el-switch v-if="showSwitch" v-model="switchCraft" active-color="#ff8800">
                </el-switch>
                <span class="ts" v-if="curProduct.detect_time">{{$moment(curProduct.detect_time).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </p>
            <magnifier :imgMagnifier="curProduct" ref="magnifier">
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
                <img class="dm-code-img" v-if="curProduct.dm_img_path" :src="curProduct.dm_img_path">
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
    			.ts {
    				font-size: 14px;
    				padding-left: 20px;
    			}
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
    				.dm-code-img {
    					position: absolute;
    					right: 40px;
    					top: 0;
    					bottom: 0;
    					margin: auto;
    					width: 80px;
    					height: 80px;
    				}
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