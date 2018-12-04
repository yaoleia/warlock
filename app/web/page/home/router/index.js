import Vue from 'vue'
import VueRouter from 'vue-router'

import DashboardPage from '../view/DashboardPage'
import RecordListPage from '../view/RecordListPage'
import ParamPage from '../view/ParamPage'

import DesignPage from '../view/DesignerPage'
import Designer from '../view/DesignerPage/Designer'
import DesignList from '../view/DesignerPage/DesignList'
import NotFound from '../view/NotFound.vue'

Vue.use(VueRouter);

export const menu = {
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
  },
  design: {
    name: '流程设计',
    path: '/design',
    redirect: '/design/designList',
    component: DesignPage,
    children: {
      list: {
        name: '流程列表',
        path: '/design/designList',
        component: DesignList
      },
      design: {
        name: '添加流程',
        path: '/design/designer/:id',
        component: Designer,
        meta: { noKeepAlive: true }
      }
    }
  },
  notFound: { path: '*', component: NotFound }
}

function _getRouer(router) {
  return Object.values(router).map(l => {
    const { children, icon, ...r } = l;
    if (children) {
      r.children = _getRouer(children);
    }
    return r;
  })
}

export function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: '/index/',
    routes: _getRouer(menu)
  });
}