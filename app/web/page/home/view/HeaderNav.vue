<template>
    <div class="header-nav">
        <el-menu router :default-active="tabactive" class='el-menu-demo' mode="horizontal">
            <template v-for='(menu_v,menu_k) in menu' v-if="menu_v.path!=='*'">
                <el-submenu v-if='menu_v.children' :index='menu_k' :key='menu_k'>
                    <template slot='title'>
                        <!-- <div :class='menu_v.icon+" icon"'></div> -->
                        <span slot='title'>{{menu_v.name}}</span>
                    </template>
                    <el-menu-item v-for='(menuChildren_v,menuChildren_k) in menu_v.children' :key='menuChildren_k' :index='menuChildren_v.path'>
                        <i class='is-children'></i>
                        <span slot='title'>{{ menuChildren_v.name }}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index='menu_v.path' :key='menu_k'>
                    <!-- <div :class='menu_v.icon+" icon"'></div> -->
                    <span slot='title'>{{menu_v.name}}</span>
                </el-menu-item>
            </template>
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
        props: ['menu'],
        mounted() { },
        watch: {
            '$route.path': function(p) {
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
    .header-nav {
        padding-top: 37px;
        position: absolute;
        right: 0;
        top: 0;
        margin: auto;
        display: flex;
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