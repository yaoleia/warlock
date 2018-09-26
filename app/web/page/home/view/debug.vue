<template>
  <div class="debug">
    <headerBtns />
    <div class="right-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="主摄像机" name="main"></el-tab-pane>
        <el-tab-pane label="辅助摄像机" name="assist"></el-tab-pane>
      </el-tabs>
      <imgStream v-if="activeName=='main'" :url="`/api/proxyurl?url=${serverUrl}/detect/video_feed_main`"></imgStream>
      <imgStream v-if="activeName=='assist'" :url="`/api/proxyurl?url=${serverUrl}/detect/video_feed_usb`"></imgStream>
    </div>
  </div>
</template>
<style lang="scss">
  .debug {
  	margin: 0 auto;
  	padding-top: 30px;
  	width: 1900px;
  	display: flex;
  	justify-content: space-between;
  	.header-btns {
  		height: auto;
  		margin-right: 100px;
  		width: 360px;
  	}
  	.right-content {
  		width: 1400px;
  		height: 1030px;
  		.el-tabs__nav-wrap {
  			height: 40px;
  		}
  		.img-stream {
  			border-radius: 9px;
  			width: 1350px;
  			height: 900px;
  			box-shadow: none;
  			background: none;
  		}
  	}
  	.el-tabs__item {
  		color: #fff;
  		opacity: 0.7;
  	}
  	.el-tabs__item.is-active {
  		color: #ff8800;
  		opacity: 1;
  	}
  	.el-tabs__active-bar {
  		background-color: #ff8800;
  	}
  	.el-tabs__nav-wrap::after {
  		background: none;
  	}
  }
  @media screen and (max-width: 1920px) {
  	.debug {
  		width: 1420px;
  		padding-top: 23px;
  		.header-btns {
  			width: 240px;
  		}
  		.right-content {
  			width: 1100px;
  			height: 730px;
  			.el-tabs__nav-wrap {
  				height: 40px;
  			}
  			.img-stream {
  				width: 1002px;
  				height: 668px;
  			}
  		}
  	}
  }
</style>
<script type="babel">
  import headerBtns from "./headerBtns.vue"
  import imgStream from "component/imgStream"
  export default {
    data() {
      return {
        activeName: "main"
      }
    },
    components: {
      headerBtns,
      imgStream
    },
    computed: {
      serverUrl() {
        return this.$store.state.serverUrl
      }
    },
    methods: {},
    beforeMount() { }
  }
</script>
