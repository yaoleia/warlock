import axios from 'framework/network/request';

export function getTaskId() {
    return axios.get('/api/task');
}

export function getTaskById(task_id) {
    return axios.get(`/api/task/${task_id}`);
}

export function postTask(json) {
    return axios.post('/api/task', json);
}

export function deleteTask(task_id) {
    return axios.delete(`/api/task/${task_id}`);
}