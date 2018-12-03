<template>
    <div class='app-body'>
        <div class='main-container'>
            <transition name="fade-transform" mode="out-in">
                <keep-alive>
                    <router-view v-if="!$route.meta.noKeepAlive"></router-view>
                </keep-alive>
            </transition>
            <transition name="fade-transform" mode="out-in">
                <router-view v-if="$route.meta.noKeepAlive"></router-view>
            </transition>
        </div>
    </div>
</template>
<style>
    @import "content.css";
</style>
<script type='babel'>
    export default {
        name: 'v-content',
        data() {
            return {}
        },
        components: {},
        mounted() { }
    }
</script>
