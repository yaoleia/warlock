<template>
  <div class="main">
    <div class="page-container page-component">
      <img :src="url" class="img" @load="loaded">
    </div>
  </div>
</template>
<style>
</style>
<script type="text/babel">
export default {
  data() {
    return {};
  },
  props: ["url"],
  components: {},
  mounted() {},
  methods: {
    loaded() {
    }
  }
};
</script>
