import { sync } from 'vuex-router-sync'
import createStore from './store/app'
import { constantRouterMap, userRouterMap, visitorRouterMap, createRouter, getRouer } from './router'

export const store = createStore()
export const router = createRouter()

const unsync = sync(store, router)
unsync()

// 加载路由完成
let routered = false;

router.beforeEach((to, from, next) => {
  if (!EASY_ENV_IS_BROWSER) return;
  let workflowid = window.sessionStorage.workflowid;
  if (workflowid && !to.query.workflowid) {
    to.query.workflowid = workflowid;
  }
  workflowid = to.query.workflowid;
  if (to.path === '/login') {
    window.sessionStorage.workflowid = '';
    store.state.username = '';
    next();
    return;
  }
  if (workflowid) {
    // 有id查看模式
    if (!routered) {
      routered = true;
      window.sessionStorage.workflowid = workflowid;
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
  window.document.title = `Sirius-${to.name}`;
})