'use strict';
import axios from 'axios';
axios.defaults.timeout = 15000;
axios.defaults.xsrfHeaderName = 'x-csrf-token';
axios.defaults.xsrfCookieName = 'csrfToken';
export default {
  post(url, json, store = {}) {
    const { state = { origin: '' } } = store;
    const headers = {};
    if (EASY_ENV_IS_NODE) {
      headers['x-csrf-token'] = state.csrf;
      headers.Cookie = `csrfToken=${state.csrf}`;
    }
    return axios.post(`${state.origin}${url}`, json, { headers });
  },
  get(url, store = {}) {
    const { state = { origin: '' } } = store;
    return axios.get(`${state.origin}${url}`);
  },
  delete(url, store = {}) {
    const { state = { origin: '' } } = store;
    return axios.delete(`${state.origin}${url}`);
  },
  patch(url, json, store = {}) {
    const { state = { origin: '' } } = store;
    const headers = {};
    if (EASY_ENV_IS_NODE) {
      headers['x-csrf-token'] = state.csrf;
      headers.Cookie = `csrfToken=${state.csrf}`;
    }
    return axios.patch(`${state.origin}${url}`, json, { headers });
  }
};