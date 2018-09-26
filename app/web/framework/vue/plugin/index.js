'use strict';
import axios from 'axios';
import request from 'framework/network/request';
import VueI18n from 'vue-i18n';
import createI18n from 'framework/i18n/site';
import moment from 'moment';

export default {
  install(Vue) {
    if (!Vue.prototype.hasOwnProperty('$request')) {
      Vue.prototype.$request = request;
    }

    if (!Vue.prototype.hasOwnProperty('$moment')) {
      Vue.prototype.$moment = moment;
    }

    if (!Vue.hookRender) {
      Vue.use(VueI18n);
      Vue.hookRender = (context, options) => {
        const i18n = createI18n(context.state.locale);
        options.i18n = i18n;
      };
    }
  }
};
