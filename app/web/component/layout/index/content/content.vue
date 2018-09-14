<template>
    <div class='app-body'>
        <div class='main-container'>
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>
<style>
    @import "content.css";
</style>
<script type='babel'>
    export default {
      name: "v-content",
      data() {
        return {}
      },
      components: {},
      mounted() {}
    }
</script>
