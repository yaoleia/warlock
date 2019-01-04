'use strict';
import axios from 'framework/network/request';
import dateFns from 'date-fns'
import clientApi from 'clientApi';

export default {
  install(Vue) {
    if (!Vue.prototype.hasOwnProperty('$http')) {
      Vue.prototype.$http = axios;
    }

    if (!Vue.prototype.hasOwnProperty('$request')) {
      Vue.prototype.$request = clientApi;
    }

    if (!Vue.prototype.hasOwnProperty('$dateFns')) {
      Vue.prototype.$dateFns = dateFns;
    }
  }
};
