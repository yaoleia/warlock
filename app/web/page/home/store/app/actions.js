'use strict';

import * as Type from './mutation-type';
import Vue from 'vue';
import Vuex from 'vuex';
import clientApi from 'clientApi'

Vue.use(Vuex);

const actions = {
  SET_RECORD_LIST: (store) => {
    return clientApi.record.getRecordList(store).then(response => {
      store.commit(Type.SET_RECORD_LIST, response.data);
    })
  },
  SET_ALGORITHM_MAP: async (store) => {
    const response = await clientApi.plugin.getPlugins(store);
    store.commit(Type.SET_ALGORITHM_MAP, response.data);
    return response;
  },
  SET_WORKFLOW_LIST: async (store) => {
    // 获取运行着的任务
    const workflows = await clientApi.workflow.getWorkflows();
    store.commit(Type.SET_WORKFLOW_LIST, workflows.data);
    return workflows;
  }
};

export default actions;
