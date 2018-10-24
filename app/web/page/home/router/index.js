import Vue from 'vue';

import VueRouter from 'vue-router';
import Dashboard from '../view/dashboard';
import ArticleList from '../view/List.vue';
import Help from '../view/Help.vue';
import Detail from '../view/Detail.vue';
import Param from '../view/Param.vue';

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
        path: '/param',
        component: Param,
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
        component: () => import('../view/Detail.vue')
      },
      {
        path: '*', component: () => import('../view/NotFound.vue')
      }
    ]
  });
}