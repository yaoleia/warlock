<template>
    <IndexLayout>
        <header-nav :menu='menu' />
    </IndexLayout>
</template>
<script type="text/babel">
    import Vue from 'vue'
    import './ui.js'
    import { constantRouterMap, userRouterMap, visitorRouterMap } from './router'
    import IndexLayout from 'component/layout/index'
    import HeaderNav from './view/HeaderNav.vue'
    import io from 'socket.io-client'
    import { router, store } from './store-router'

    export default {
        router,
        store,
        data() {
            return {
                menu: null,
                workflowid: null
            }
        },
        components: {
            IndexLayout,
            HeaderNav
        },
        beforeMount() {
            this.checkMode();
        },
        provide() {
            return {
                socket: this.startWsConnection()
            }
        },
        computed: {
            username() {
                return this.$store.state.username;
            }
        },
        watch: {
            workflowid(id) {
                if (id) {
                    this.menu = { ...visitorRouterMap, ...constantRouterMap }
                }
            }
        },
        methods: {
            checkMode() {
                const query = this.$route.query;
                if (query.workflowid) {
                    this.workflowid = query.workflowid;
                } else {
                    if (this.username) {
                        this.menu = { ...userRouterMap, ...constantRouterMap }
                    }
                }
            },
            startWsConnection() {
                const ws = io('/', {
                    query: {
                        room: 'admin',
                        // userId: `client_${Math.random()}`,
                    },
                    transports: ['websocket']
                })
                ws.on('connect', () => {
                    console.log('websocket successfully connected !')
                })

                ws.on('disconnect', () => {
                    console.log('websocket successfully closed')
                })
                ws.on('connect_error', () => {
                    this.$message.error('连接已断开');
                })
                return ws;
            }
        }
    }
</script>
