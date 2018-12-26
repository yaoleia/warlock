<template>
    <IndexLayout>
        <header-nav :menu='menu' />
    </IndexLayout>
</template>
<script type="text/babel">
    import Vue from 'vue'
    import { sync } from 'vuex-router-sync'
    import createStore from './store/app'
    import { constantRouterMap, userRouterMap, visitorRouterMap, createRouter, getRouer } from './router'
    import IndexLayout from 'component/layout/index'
    import HeaderNav from './view/HeaderNav.vue'
    import io from 'socket.io-client'
    import ElementUI from 'element-ui'
    import VueIconfont from 'vue-iconfont'
    import 'asset/css/element-variables.scss'
    import 'asset/css/transition.scss'

    // 引入iconfont
    import 'asset/iconfont/iconfont.css'
    // import 'asset/iconfont/iconfont.js'
    Vue.use(VueIconfont, [
        // 定义 v-icon 组件以使用 font-class 图标
        {
            tag: 'v-icon',
            prefix: 'v-icon',
            type: 'font'
        },
        // 定义 v-svg-icon 组件以使用 SVG 图标
        {
            tag: 'v-svg-icon',
            prefix: 'v-icon',
            type: 'svg'
        }
    ])

    Vue.use(ElementUI);
    Vue.config.devtools = true;

    const store = createStore()
    const router = createRouter()
    const unsync = sync(store, router)
    unsync()

    // 加载路由完成
    let routered = false;

    router.beforeEach((to, from, next) => {
        if (!EASY_ENV_IS_BROWSER) return;
        const designId = window.sessionStorage.designId;
        if (designId && !to.query.id) {
            to.query.id = designId;
        }
        const id = to.query.id;
        if (to.path === '/login') {
            window.sessionStorage.designId = '';
            store.state.username = '';
            to.query.id = ''
            next();
            return;
        }
        if (id) {
            // 有id查看模式
            if (!routered) {
                routered = true;
                window.sessionStorage.designId = id;
                router.addRoutes(getRouer(visitorRouterMap)) // 动态添加可访问路由表
                next({ path: '/', query: to.query })
                return;
            }
            next();
        } else {
            // 设计模式
            if (!routered && store.state.username) {
                routered = true;
                router.addRoutes(getRouer({ ...userRouterMap, ...constantRouterMap })) // 动态添加可访问路由表
                next({ path: '/design/designList' })
                return;
            }
            if (!store.state.username) {
                if (to.path !== '/login') {
                    next({ path: '/login' })
                    return;
                }
            }
            if (to.path === '/') {
                next({ path: '/design/designList' })
                return;
            }
            next()
        }
    });

    export default {
        router,
        store,
        data() {
            return {
                globalWebsocket: null,
                menu: null,
                designId: null
            }
        },
        components: {
            IndexLayout,
            HeaderNav
        },
        beforeMount() {
            this.checkMode();
        },
        mounted() {
            this.startWsConnection();
        },
        computed: {
            username() {
                return this.$store.state.username;
            }
        },
        watch: {
            designId(id) {
                if (id) {
                    this.menu = { ...visitorRouterMap, ...constantRouterMap }
                }
            }
        },
        methods: {
            checkMode() {
                const query = this.$route.query;
                if (query.id) {
                    this.designId = query.id;
                } else {
                    if (this.username) {
                        this.menu = { ...userRouterMap, ...constantRouterMap }
                    }
                }
            },
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
