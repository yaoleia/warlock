'use strict';
import axios from 'framework/network/request';
import moment from 'moment';
import clientApi from 'clientApi';

export default {
  install(Vue) {
    if (!Vue.prototype.hasOwnProperty('$http')) {
      Vue.prototype.$http = axios;
    }

    if (!Vue.prototype.hasOwnProperty('$request')) {
      Vue.prototype.$request = clientApi;
    }

    if (!Vue.prototype.hasOwnProperty('$moment')) {
      Vue.prototype.$moment = moment;
    }
  }
};
