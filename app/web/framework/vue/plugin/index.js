'use strict';
import request from 'framework/network/request';
import moment from 'moment';

export default {
  install(Vue) {
    if (!Vue.prototype.hasOwnProperty('$request')) {
      Vue.prototype.$request = request;
    }

    if (!Vue.prototype.hasOwnProperty('$moment')) {
      Vue.prototype.$moment = moment;
    }
  }
};
