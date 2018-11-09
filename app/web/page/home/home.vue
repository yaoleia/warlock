<template>
    <IndexLayout>
        <header-nav />
    </IndexLayout>
</template>
<script type="text/babel">
    import Vue from "vue"
    import { sync } from "vuex-router-sync"
    import createStore from "./store/app"
    import createRouter from "./router"
    import IndexLayout from "component/layout/index"
    import HeaderNav from "./view/HeaderNav.vue"
    import io from "socket.io-client"
    import ElementUI from 'element-ui';
    import 'asset/css/element-variables.scss';

    Vue.use(ElementUI);

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
            HeaderNav
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
                ws.on("connect_error", () => {
                    this.$message.error('ws连接错误');
                })
                // this.setWebsocket(ws)
                window.ws = ws
            }
        }
    }
</script>
