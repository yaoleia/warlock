import Vue from 'vue';

import VueRouter from 'vue-router';
import DashboardPage from '../view/DashboardPage';
import RecordListPage from '../view/RecordListPage';
import HelpPage from '../view/HelpPage';
import DetailPage from '../view/DetailPage';
import ParamPage from '../view/ParamPage';

Vue.use(VueRouter);

export default function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: '/index/',
    routes: [
      {
        path: '/',
        component: DashboardPage
      },
      {
        path: '/record',
        component: RecordListPage
      },
      {
        path: '/help',
        component: HelpPage
      },
      {
        path: '/detail',
        component: DetailPage
      },
      {
        path: '/param',
        component: ParamPage,
        meta: {
          noKeepAlive: true
        }
      },
      {
        path: '/article/add',
        component: () => import('../view/WritePage')
      },
      {
        path: '/article/detail/:id',
        component: () => import('../view/DetailPage')
      },
      {
        path: '*', component: () => import('../view/NotFound.vue')
      }
    ]
  });
}