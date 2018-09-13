<template>
    <header class="header">
        <div class="right">
            <span class="header-btn">
                <a v-bind:href="$t('lang.href')">
                    <i class="el-icon-message"></i>
                </a>
            </span>
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
