<template>
    <div class='app-body'>
        <div class='main-container'>
            <transition name="el-fade-in">
                <!-- <keep-alive> -->
                    <router-view></router-view>
                <!-- </keep-alive> -->
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
