import axios from 'framework/network/request';

export function getStart() {
    return axios.get('/api/start')
}

export function getStop() {
    return axios.get('/api/stop')
}

export function postParam(name, json) {
    return axios.post(`/api/${name}`, json)
}

export function postLight(json) {
    return axios.post('/api/light', json)
}

export function postTonce() {
    return axios.post('/api/tonce')
}
