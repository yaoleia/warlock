<template>
    <div class="img-stream">
        <img :src="url" class="img" @load="loaded">
    </div>
</template>
<style lang="scss">
    .img-stream {
      width: 100%;
      height: 100%;
      .img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
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
