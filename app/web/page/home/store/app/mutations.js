'use strict';

import {
  SET_ARTICLE_LIST
} from './mutation-type';

const mutations = {
  [SET_ARTICLE_LIST](state, { list, total }) {
    state.recordTotal = total;
    state.recordList = list;
  }
};
export default mutations;
