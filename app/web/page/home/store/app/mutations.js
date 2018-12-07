'use strict';

import {
  SET_ARTICLE_LIST,
  SET_ALGORITHM_MAP
} from './mutation-type';

const mutations = {
  [SET_ARTICLE_LIST](state, { list, total }) {
    state.recordTotal = total;
    state.recordList = list;
  },
  [SET_ALGORITHM_MAP](state, json) {
    state.algorithmMap = json;
  }
};
export default mutations;
