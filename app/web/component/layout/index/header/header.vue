<template>
    <header class="header">
        <el-dropdown>
            <span class="el-dropdown-link">
                硬件
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>主摄像机</el-dropdown-item>
                <el-dropdown-item>辅助摄像机</el-dropdown-item>
                <el-dropdown-item>光源</el-dropdown-item>
                <el-dropdown-item>激光触发</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown>
            <span class="el-dropdown-link">
                算法
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>差分</el-dropdown-item>
                <el-dropdown-item>检测</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
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
    .header {
        .el-dropdown {
            line-height: 50px;
            margin: 0 30px;
            cursor: pointer;
            color: #fff;
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
        sidebarToggle(e) {
          e.preventDefault()
          if (this.collapse) {
            document.body.classList.remove("sidebar-hidden")
            this.siteName = "IBlog"
            this.collapse = false
          } else {
            document.body.classList.add("sidebar-hidden")
            this.collapse = true
          }
        },
        logout() {
          window.location.replace("/login")
        },
        switchLang(lang) {
          window.location.href = `/index?locale=${lang}`
        }
      },
      mounted: function() {
        if (!this.collapse) {
          document.body.classList.remove("sidebar-hidden")
          this.siteName = "IBlog"
        } else {
          document.body.classList.add("sidebar-hidden")
        }
      }
    }
</script>
