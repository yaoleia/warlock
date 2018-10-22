import Vue from 'vue';

import VueRouter from 'vue-router';
import Dashboard from '../view/dashboard/index.vue';
import ArticleList from '../view/list.vue';
import Help from '../view/help.vue';
import Detail from '../view/detail.vue';
import Debug from '../view/debug.vue';

Vue.use(VueRouter);

export default function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: '/index/',
    routes: [
      {
        path: '/',
        component: Dashboard
      },
      {
        path: '/list',
        component: ArticleList
      },
      {
        path: '/help',
        component: Help
      },
      {
        path: '/detail',
        component: Detail
      },
      {
        path: '/debug',
        component: Debug,
        meta: {
          noKeepAlive: true
        }
      },
      {
        path: '/article/add',
        component: () => import('../view/write/index.vue')
      },
      {
        path: '/article/detail/:id',
        component: () => import('../view/detail.vue')
      },
      {
        path: '*', component: () => import('../view/notfound.vue')
      }
    ]
  });
}