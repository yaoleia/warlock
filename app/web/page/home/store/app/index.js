'use strict';
import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import createLogger from 'vuex/dist/logger';
Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';

export default function createStore() {
  const state = {
    articleTotal: 0,
    articleList: [],
    article: {}
  };
  return new Vuex.Store({
    state,
    actions,
    getters,
    mutations,
    plugins: debug && EASY_ENV_IS_BROWSER ? [createLogger()] : []
  });
}
