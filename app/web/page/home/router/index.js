import Vue from 'vue'
import VueRouter from 'vue-router'

import DashboardPage from '../view/DashboardPage'
import RecordListPage from '../view/RecordListPage'
import ParamPage from '../view/ParamPage'

import DesignPage from '../view/DesignerPage'
import Designer from '../view/DesignerPage/Designer'
import DesignList from '../view/DesignerPage/DesignList'
import NotFound from '../view/NotFound.vue'
import Login from '../view/LoginPage'
import UploadPage from '../view/UploadPage'

Vue.use(VueRouter);

// 通用路由
export const constantRouterMap = {
  notFound: { path: '*', component: NotFound, meta: { hide: true } },
  login: { path: '/login', component: Login, meta: { hide: true } }
}

// 需要权限路由
export const userRouterMap = {
  design: {
    name: '流程设计',
    path: '/design',
    redirect: '/design/designList',
    component: DesignPage,
    meta: { role: ['admin'] },
    children: {
      list: {
        icon: 'el-icon-document',
        name: '流程列表',
        path: '/design/designList',
        component: DesignList,
        meta: { role: ['admin'] }
      },
      design: {
        icon: 'el-icon-circle-plus-outline',
        name: '新建流程',
        path: '/design/designer/:id',
        component: Designer,
        meta: { role: ['admin'], noKeepAlive: true }
      }
    }
  },
  upload: {
    name: '插件管理',
    path: '/upload',
    component: UploadPage,
    meta: { role: ['admin'] }
  }
}

// 只查看路由
export const visitorRouterMap = {
  home: {
    name: '首页',
    path: '/',
    component: DashboardPage
  },
  record: {
    name: '历史记录',
    path: '/record',
    component: RecordListPage
  },
  param: {
    name: '参数调试',
    path: '/param',
    component: ParamPage,
    meta: {
      noKeepAlive: false
    }
  }
}

export function getRouer(router) {
  router = _.cloneDeep(router);
  return Object.values(router).map(l => {
    const { children, icon, ...r } = l;
    if (children) {
      r.children = getRouer(children);
    }
    return r;
  })
}

export function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: '/index/',
    routes: getRouer(constantRouterMap)
  });
}