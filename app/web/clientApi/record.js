import axios from 'framework/network/request';

export function getRecordList(store) {
    return axios.get('/api/record', store);
}