<template>
    <div class="header-nav">
        <el-menu router :default-active="tabactive" class='el-menu-demo' mode="horizontal">
            <template v-for='(menu_v,menu_k) in menuFilter'>
                <el-submenu v-if='menu_v.children' :index='menu_k' :key='menu_k'>
                    <template slot='title'>
                        <!-- <div :class='menu_v.icon+" icon"'></div> -->
                        <span slot='title'>{{menu_v.name}}</span>
                    </template>
                    <el-menu-item v-for='(menuChildren_v,menuChildren_k) in menu_v.children' :key='menuChildren_k' :index='menuChildren_v.path'>
                        <i class='is-children'></i>
                        <div :class='menuChildren_v.icon+" icon"'></div>
                        <span slot='title'>{{ menuChildren_v.name }}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index='menu_v.path' :key='menu_k'>
                    <!-- <div :class='menu_v.icon+" icon"'></div> -->
                    <span slot='title'>{{menu_v.name}}</span>
                </el-menu-item>
            </template>
        </el-menu>
        <div class="logout" v-if="username&&!$root.workflowid">
            <v-icon name='user'></v-icon>
            <el-button type="text" @click='logout'>退出</el-button>
        </div>
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
        props: ['menu'],
        watch: {
            '$route.path': function(p) {
                this.tabactive = p
            }
        },
        computed: {
            username() {
                return this.$store.state.username;
            },
            menuFilter() {
                const menu = {};
                for (const key in this.menu) {
                    if (this.menu.hasOwnProperty(key)) {
                        const element = this.menu[key];
                        if (!element.meta || element.meta && !element.meta.hide) {
                            menu[key] = element;
                        }
                    }
                }
                return menu;
            }
        },
        methods: {
            async logout() {
                const p = await this.$confirm('确认退出登录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (p) {
                    await this.$request.account.logout();
                    window.location.href = '/index/login';
                }
            },
            slider() { }
        },
        components: {}
    }
</script>

<style lang="scss">
    .header-nav {
        height: 100px;
        position: absolute;
        right: 0;
        top: 0;
        margin: auto;
        display: flex;
        align-items: center;
        .el-menu {
            height: 34px;
        }
        .logout {
            margin-left: 50px;
            color: #aaa;
            .el-button {
                font-size: 18px;
                color: #aaa;
                &:hover {
                    color: #ff8800;
                }
            }
            .v-icon-user {
                font-size: 30px;
            }
        }
    }
    #app {
        .el-menu--horizontal {
            border: none;
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

        .el-menu--horizontal > .el-submenu:focus .el-submenu__title,
        .el-menu--horizontal > .el-submenu:hover .el-submenu__title,
        .el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
        .el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
            color: #ff8800;
        }

        .el-menu--horizontal > .el-menu-item.is-active {
            color: #ff8800;
            background: none;
            border-bottom: 2px solid #ff8800;
            opacity: 1;
        }
        .el-menu--horizontal .el-submenu.is-active {
            > .el-submenu__title {
                opacity: 1;
                color: #ff8800;
            }
            .el-submenu__icon-arrow {
                color: #ff8800;
            }
        }
        .el-menu--horizontal > .el-submenu {
            .el-submenu__icon-arrow {
                font-size: 16px;
                font-weight: bold;
            }
        }
        .el-menu--horizontal > .el-submenu .el-submenu__title {
            margin-right: 0;
            line-height: 30px;
            height: 33px;
            color: #fff;
            font-size: 18px;
            padding: 0;
        }

        .el-menu--horizontal > .el-menu-item,
        .el-menu--horizontal > .el-submenu {
            line-height: 30px;
            height: 33px;
            color: #fff;
            font-size: 18px;
            padding: 0;
            margin-right: 60px;
            font-weight: lighter;
            font-weight: 300;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    body > div.el-menu--horizontal {
        .el-menu--popup {
            min-width: 90px;
            text-align: center;
            > .el-menu-item {
                background: none;
                .icon {
                    margin: 0;
                    width: 18px;
                }
            }
        }
        .el-menu {
            background: #2d2d2d;
            border-radius: 4px;
            box-shadow: 2px 2px 7px 0 #000;
        }
        .el-menu-item:not(.is-disabled):hover,
        .el-menu-item:not(.is-disabled):focus,
        .el-menu .el-menu-item.is-active,
        .el-menu .el-submenu.is-active > .el-submenu__titlec {
            color: #ff8800;
        }
    }
</style>