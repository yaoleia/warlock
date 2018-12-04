<template>
    <IndexLayout>
        <header-nav :menu='menu' />
    </IndexLayout>
</template>
<script type="text/babel">
    import Vue from 'vue'
    import { sync } from 'vuex-router-sync'
    import createStore from './store/app'
    import { createRouter, menu } from './router'
    import IndexLayout from 'component/layout/index'
    import HeaderNav from './view/HeaderNav.vue'
    import io from 'socket.io-client'
    import ElementUI from 'element-ui'
    import 'asset/css/element-variables.scss'
    import 'asset/css/transition.scss'

    Vue.use(ElementUI);

    const store = createStore()
    const router = createRouter()
    const unsync = sync(store, router)
    unsync()

    export default {
        router,
        store,
        data() {
            return {
                globalWebsocket: null,
                menu
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
                const ws = io('/')

                ws.on('connect', () => {
                    console.log('websocket successfully connected !')
                })

                ws.on('disconnect', () => {
                    console.log('websocket successfully closed')
                })
                ws.on('connect_error', () => {
                    this.$message.error('ws连接错误');
                })
                // this.setWebsocket(ws)
                window.ws = ws
            }
        }
    }
</script>
