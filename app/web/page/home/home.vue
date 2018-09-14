<template>
    <IndexLayout>
        <headerBtns/>
    </IndexLayout>
</template>
<script type="text/babel">
    import Vue from "vue"
    import ElementUI from "element-ui"
    import { sync } from "vuex-router-sync"
    import "element-ui/lib/theme-chalk/index.css"
    import createStore from "./store/app"
    import createRouter from "./router"
    import IndexLayout from "component/layout/index"
    import headerBtns from "./view/headerBtns.vue"

    Vue.use(ElementUI)

    const store = createStore()
    const router = createRouter()
    sync(store, router)

    export default {
      router,
      store,
      components: {
        IndexLayout,
        headerBtns
      }
    }
</script>
