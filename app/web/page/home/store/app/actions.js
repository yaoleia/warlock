'use strict';

import * as Type from './mutation-type';
import Vue from 'vue';
import Vuex from 'vuex';
import request from 'framework/network/request';

Vue.use(Vuex);

const actions = {
  SET_ARTICLE_LIST: (store, json) => {
    return request.post('/api/article/list', json, store).then(response => {
      store.commit(Type.SET_ARTICLE_LIST, response.data);
    })
  },
  SET_ALGORITHM_MAP: async (store) => {
    const response = await import('../../algorithm_conf.json');
    store.commit(Type.SET_ALGORITHM_MAP, response.default);
    return response;
  }
};

export default actions;
