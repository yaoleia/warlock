<template>
    <header class="header">
        <slot></slot>
        <div class="right">
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
        </div>
    </header>
</template>
<style lang="scss">
    .sidebar-hidden {
      .header {
        .logo {
          .big {
            display: none;
          }
          .min {
            display: block;
          }
          width: 64px;
        }
      }

      .app-body {
        margin-left: 80px;
      }
    }
</style>
<script type="babel">
    import "./header.scss"
    export default {
      components: {},
      data() {
        return {
          collapse: false,
          site: {
            name: "We-Blog",
            description: "IBlog"
          }
        }
      },
      computed: {},
      methods: {
        logout() {
          window.location.replace("/login")
        }
      },
      mounted: function() {
        
      }
    }
</script>
