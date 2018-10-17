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
				showSwitch: false,
				canScroll: true
			}
		},
		computed: {
			serverUrl() {
				return this.$store.state.serverUrl
			}
		},
		beforeMount() {
			// 只会在浏览器执行
			// this.$options.components.webcam = () => import("component/webcam")
		},
		methods: {
			ifOk(type) {
				return utils.ifOk(type)
			},
			defectType(type) {
				return utils.defectType(type)
			},
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
						this.curProduct = { ...curObj, ...m }
					}
					m.act = false;
					this.productList.unshift(m);
					if (m.defect_type != 0) {
						this.$notify({
							title: `PID: ${m.dm_code}`,
							customClass: "warlock-warning-notify",
							dangerouslyUseHTMLString: true,
							message: `<div class="dm-img">
													<p>缺陷: ${this.defectType(m.defect_type)}</p>
													<img class="dm" src="${m.dm_img_path}">
													<img class="seg-img" src="${m.seg_img_path}">
												</div>
												<div class="img"><img src="${m.mask_img_path}"></div>`,
							type: "warning",
							position: "bottom-right",
							onClick() {
								console.log(m)
							}
						});
					}
				})
			},
			listItemClick(p) {
				this.switchCraft = false;
				this.curProduct = { ...curObj, ...p }
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
			},
			curProduct(p) {
				if (!p.dm_code) return;
				this.$refs.magnifier.close();
				$(".flicker", this.$el).finish().fadeOut("fast").fadeIn("fast");
				this.productList.forEach(l => {
					l.act = l.dm_code === p.dm_code ? true : false;
				})
				if (this.switchCraft && this.canScroll) {
					$(".list-wrap", this.$el)[0].scrollTop = 0;
				}
			},
			productList(list) {
				while (list.length > 100) {
					list.pop();
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
			<imgStream class="mb30" title="拍摄原图" :url="`${serverUrl}/detect/video_feed_usb`"></imgStream>
			<imgStream title="目标定位" class="msg-box" :url="curProduct.seg_img_path">
				<div class="msg flicker" v-if="curProduct.detect_time">
					<p class="ts">{{$moment(curProduct.detect_time).format('YYYY-MM-DD HH:mm:ss')}}</p>
					<div class="qa">
						<span :class="ifOk(curProduct.defect_type) === 'OK'?'':'red'">{{ifOk(curProduct.defect_type)}}</span>
						<span> {{defectType(curProduct.defect_type)}} </span><br>
						<span> {{curProduct.dm_code}} </span>
						<img class="dm-code-img" v-if="curProduct.dm_img_path" :src="curProduct.dm_img_path">
					</div>
				</div>
			</imgStream>
		</div>
		<div class="middle-img-col col">
			<p class="title">
				<span>检测结果</span>
				<el-switch v-if="showSwitch" v-model="switchCraft" active-color="#ff8800">
				</el-switch>
			</p>
			<transition name="el-fade-in-linear">
				<big-area v-show="curProduct.cut.width" class="result" :opt="curProduct"></big-area>
			</transition>
			<magnifier :imgMagnifier="curProduct" ref="magnifier">
				<imgStream class="img-big" v-if="curProduct.reg_img_path" :url="curProduct.reg_img_path"></imgStream>
				<imgStream :url="curProduct.mask_img_path"></imgStream>
			</magnifier>
		</div>
		<div class="right-img-col col" @mousemove.prevent="canScroll=false" @mouseleave.prevent="canScroll=true">
			<p class="title">
				<span>实时记录</span>
			</p>
			<div class="list-wrap">
				<transition-group name="list-complete" tag="p">
					<div class="list-complete-item" :class="p.act?'act':''" :key="p.detect_time" v-for="(p) in productList" @click="listItemClick(p)">
						<div class="dm-img">
							<!-- <img class="dm" :src="p.dm_img_path"> -->
							<p>PID: {{p.dm_code}}</p>
							<p class="ts">检测时间: {{$moment(p.detect_time).format('YYYY-MM-DD HH:mm:ss')}}</p>
							<p class="defect" v-if='p.defect_type != 0'>缺陷: <span class="red">{{defectType(p.defect_type)}}</span></p>
							<span class="ng" v-if='p.defect_type != 0'>NG</span>
						</div>
					</div>
				</transition-group>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	::selection {
		background: transparent;
	}

	.warlock-warning-notify {
		color: #ddd;
		background-color: rgba(244, 67, 54, 0.7);
		border: none;
		height: 280px;
		width: 400px;
		.el-notification__group {
			height: 100%;
			width: 100%;
		}
		.el-notification__title {
			color: #ddd;
		}
		.img {
			width: 100px;
			height: 200px;
		}
		img {
			width: 100%;
			height: 100%;
		}
		.el-notification__content > p {
			padding-top: 15px;
			display: flex;
		}
		.dm-img {
			width: 150px;
			height: 200px;
			margin-right: 40px;
			color: #ddd;
			line-height: 25px;
			> p {
				display: inline-block;
				border-radius: 4px;
				line-height: 20px;
				padding: 8px;
				background: rgba(204, 204, 204, 0.2);
				margin-bottom: 10px;
				color: #fff;
			}
			.dm {
				width: 60px;
				height: 60px;
			}
			.seg-img {
				width: 120px;
				height: 80px;
			}
		}
		.el-notification__closeBtn.el-icon-close {
			color: #eee;
		}
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
				.msg {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					padding: 60px;
					color: #9c9c9c;
					line-height: 25px;
					.ts {
						border-radius: 5px;
						position: absolute;
						left: 65px;
						top: 71px;
						background: rgba($color: #ccc, $alpha: 0.2);
						padding: 5px;
					}
					.qa {
						position: absolute;
						right: 65px;
						bottom: 65px;
						height: 70px;
						padding: 10px 70px 10px 0;
						text-align: right;
						background: rgba(204, 204, 204, 0.2);
						border-radius: 5px;
						.dm-code-img {
							position: absolute;
							right: 5px;
							top: 5px;
							width: 60px;
							height: 60px;
						}
						.red {
							color: #f44336;
						}
						span {
							margin-left: 10px;
						}
					}
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
				.result {
					position: absolute;
					left: -640px;
					top: 66px;
					width: 660px;
					height: 660px;
					box-shadow: 10px 10px 8px 0 #000;
				}
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
				}
			}
			&.right-img-col {
				width: 520px;
				position: relative;
				background: rgba(255, 255, 255, 0.06);
				border-radius: 18px;
				height: 1082px;
				padding: 66px 20px 60px 40px;
				display: block;
				overflow: hidden;
				.list-wrap {
					overflow: auto;
					width: 100%;
					height: 100%;
					padding-right: 30px;
					.list-complete-item {
						width: 100%;
						display: flex;
						color: #9c9c9c;
						padding: 10px 20px;
						cursor: pointer;
						border-radius: 5px;
						border-bottom: 1px solid #444;
						line-height: 30px;
						position: relative;
						&.act {
							background: #222;
						}
						&:last-child {
							border: none;
						}
						.ts,
						.defect {
							font-size: 14px;
							color: #888;
						}
						img {
							width: 100%;
							height: 100%;
						}
						.seg-img {
							width: 180px;
							height: 120px;
						}
						.dm {
							width: 60px;
							height: 60px;
						}
						.img {
							width: 100px;
							height: 200px;
						}
						.dm-img {
							span.red {
								color: #f44336;
							}
							.ng {
								position: absolute;
								top: 20px;
								right: 20px;
								z-index: 1;
								width: 24px;
								height: 24px;
								line-height: 24px;
								font-size: 13px;
								background-color: #f44336;
								color: #373535;
								text-align: center;
								border-radius: 50%;
								box-shadow: 0 0 0 4px rgba(218, 37, 29, 0.5);
							}
						}
					}
				}
			}
		}
	}
</style>