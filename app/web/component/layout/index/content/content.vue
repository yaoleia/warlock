<template>
    <div class='app-body'>
        <div class='main-container'>
            <keep-alive>
                <router-view v-if="!$route.meta.noKeepAlive"></router-view>
            </keep-alive>
            <router-view v-if="$route.meta.noKeepAlive"></router-view>
        </div>
    </div>
</template>
<style>
    @import 'content.css';
</style>
<script type='babel'>
    export default {
        name: "v-content",
        data() {
            return {}
        },
        components: {},
        mounted() { }
    }
</script>
