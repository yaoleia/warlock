<template>
    <IndexLayout>
        <navs />
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
    import navs from "./view/nav.vue"
    import io from "socket.io-client"

    Vue.use(ElementUI)

    const store = createStore()
    const router = createRouter()
    sync(store, router)

    export default {
        router,
        store,
        data() {
            return {
                globalWebsocket: null
            }
        },
        components: {
            IndexLayout,
            navs
        },
        mounted() {
            this.startWsConnection()
        },
        methods: {
            setWebsocket(w) {
                this.globalWebsocket = w
            },
            stopWsConnection() {
                if (this.globalWebsocket) {
                    this.globalWebsocket.close()
                    this.setWebsocket(null)
                }
            },
            startWsConnection() {
                this.stopWsConnection()
                let ws = io(`/`)

                ws.on("connect", () => {
                    console.log(`websocket successfully connected !`)
                })

                ws.on("disconnect", () => {
                    console.log("websocket successfully closed")
                })
                // this.setWebsocket(ws)
                window.ws = ws
            }
        }
    }
</script>
