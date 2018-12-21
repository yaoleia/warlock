'use strict';

import * as Type from './mutation-type';
import Vue from 'vue';
import Vuex from 'vuex';
import request from 'framework/network/request';

Vue.use(Vuex);

const actions = {
  SET_RECORD_LIST: (store) => {
    return request.get('/api/record', store).then(response => {
      store.commit(Type.SET_RECORD_LIST, response.data);
    })
  },
  SET_ALGORITHM_MAP: async (store) => {
    // const response = await import('../../algorithm_conf.json');
    // store.commit(Type.SET_ALGORITHM_MAP, response.default);

    const response = await request.get('/api/plugin', store);
    store.commit(Type.SET_ALGORITHM_MAP, response.data);
    return response;
  }
};

export default actions;
