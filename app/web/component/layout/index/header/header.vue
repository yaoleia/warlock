<template>
    <header class="header">
        <img src="~asset/images/logo_@2x.png" class="logo" title="双击全屏,单击返回首页" @dblclick.stop="dblclick" @click="click">
        <screen-full ref='screenFull' v-show="false"></screen-full>
        <slot></slot>
        <!-- <div class="right">
            <el-dropdown>
                <span class="header-btn">
                    Index
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div> -->
    </header>
</template>
<style lang="scss">
    .header {
        .logo {
            cursor: pointer;
            width: 180px;
            .big {
                display: none;
            }
            .min {
                display: block;
            }
        }
    }
</style>
<script type="babel">
    import ScreenFull from 'component/Screenfull'
    import './header.scss'
    export default {
        components: {
            ScreenFull
        },
        data() {
            return {
                collapse: false,
                site: {
                    name: 'We-Blog',
                    description: 'IBlog'
                }
            }
        },
        computed: {},
        methods: {
            click() {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.$router.push('/');
                }, 300);
            },
            dblclick() {
                clearTimeout(this.timer);
                this.$refs.screenFull.click();
            },
            logout() {
                window.location.replace('/login')
            }
        },
        mounted() { }
    }
</script>
