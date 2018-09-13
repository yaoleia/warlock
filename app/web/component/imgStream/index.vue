<template>
    <div class="main">
        <div class="page-container page-component">
            <img :src="url?url:'/api/proxyurl?url=http://0.0.0.0:5000/video_feed'" class="img" @load="loaded">
        </div>
    </div>
</template>
<style>
</style>
<script type="text/babel">
    export default {
      data() {
        return {}
      },
      props: ["url"],
      components: {},
      mounted() {},
      methods: {
        loaded() {}
      }
    }
</script>
