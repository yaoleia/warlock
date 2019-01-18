'use strict';

import {
  SET_RECORD_LIST,
  SET_ALGORITHM_MAP,
  SET_WORKFLOW_LIST
} from './mutation-type';

const mutations = {
  [SET_RECORD_LIST](state, { list, total }) {
    state.recordTotal = total;
    state.recordList = list;
  },
  [SET_ALGORITHM_MAP](state, json) {
    state.algorithmMap = json;
  },
  [SET_WORKFLOW_LIST](state, json) {
    state.workflowList = json;
  }
};
export default mutations;
