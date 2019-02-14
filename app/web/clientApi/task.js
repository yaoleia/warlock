import axios from 'framework/network/request';

export function getTasks() {
    return axios.get('/api/task');
}

export function getTaskId() {
    return axios.get('/api/task/new');
}

export function getTaskById(task_id) {
    return axios.get(`/api/task/${task_id}`);
}

export function postTask(json) {
    return axios.post('/api/task', json);
}

export function deleteTask(workflowid) {
    // 根据workflow删除task
    return axios.delete(`/api/task/${workflowid}`);
}

export function deleteTestTask(task_id) {
    // 根据workflow删除task
    return axios.delete(`/api/testtask/${task_id}`);
}