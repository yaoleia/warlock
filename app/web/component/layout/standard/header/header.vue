<template>
  <header class="header">
    <div class="container">
      <ul class="nav">
        <li class="nav-item"><a href="/" :class="{'active' : selectedMenu === '/'}">Server-Render</a></li>
        <!-- <li class="nav-item"><a href="/client" :class="{'active' : selectedMenu === '/client'}">Client-Render</a></li> -->
      </ul>
    </div>
  </header>
</template>
<style>
@import "./header.css";
</style>
<script type="text/babel">
export default {
  data() {
    return {
      selectedMenu: "/"
    };
  },
  computed: {},
  mounted() {
    this.selectedMenu = window.location.pathname.toLowerCase();
  }
};
</script>
