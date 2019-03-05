import axios from 'framework/network/request';

export function logout() {
  return axios.get('/logout');
}

export function login(json) {
  return axios.post('/api/login', json)
}