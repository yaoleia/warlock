<template>
    <div class="navs-wrap">
        <el-menu router :default-active="tabactive" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/list">历史记录</el-menu-item>
            <el-menu-item index="/param">参数调试</el-menu-item>
            <!-- <el-menu-item index="/help">帮助</el-menu-item> -->
        </el-menu>
    </div>
</template>

<script type="text/babel">
    export default {
        data() {
            return {
                tabactive: this.$route.path,
                value: 0
            }
        },
        mounted() { },
        watch: {
            "$route.path": function (p) {
                this.tabactive = p
            }
        },
        methods: {
            slider() { }
        },
        components: {}
    }
</script>

<style lang="scss">
    .block {
    	padding-right: 30px;
    	width: 530px;
    	height: 120px;
    	display: flex;
    	justify-content: space-around;
    	.el-button {
    		color: #fff;
    	}
    	.el-slider {
    		width: 350px;
    	}
    	.el-slider__runway {
    		margin: 22px 0;
    	}
    }

    .navs-wrap {
    	padding-top: 37px;
    	position: absolute;
    	right: 0;
    	top: 0;
    	margin: auto;
    	display: flex;
    	.el-menu--horizontal {
    		border: none;
    	}
    }

    .el-dropdown-menu__item--divided:before,
    .el-menu,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
    	border-right: none;
    	background: none;
    	color: #ff8800;
    	opacity: 1;
    }

    .el-menu--horizontal > .el-menu-item.is-active {
    	color: #ff8800;
    	background: none;
    	border-bottom: 2px solid #ff8800;
    	opacity: 1;
    }

    .el-menu--horizontal > .el-menu-item {
    	line-height: 30px;
    	height: 33px;
    	color: #fff;
    	font-size: 18px;
    	padding: 0;
    	margin-right: 60px;
    	font-weight: lighter;
    	opacity: 0.7;
    	&:last-child {
    		margin-right: 0;
    	}
    }
</style>