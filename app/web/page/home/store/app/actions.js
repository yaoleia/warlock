'use strict';

import * as Type from './mutation-type';
import Vue from 'vue';
import Vuex from 'vuex';
import request from 'framework/network/request';

Vue.use(Vuex);

const actions = {
  SET_ARTICLE_LIST: async (store, json) => {
    return request.post('/api/article/list', json, store).then(response => {
      store.commit(Type.SET_ARTICLE_LIST, response.data);
    })
  }
};

export default actions;
