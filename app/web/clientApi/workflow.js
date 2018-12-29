import axios from 'framework/network/request';

export function patchWorkflow(id, json) {
    return axios.patch(`/api/workflow/${id}`, json);
}

export function postWorkflow(json) {
    return axios.post('/api/workflow', json);
}

export function getWorkflowById(id) {
    return axios.get(`/api/workflow/${id}`);
}

export function deleteWorkflow(id) {
    return axios.delete(`/api/workflow/${id}`);
}

export function getWorkflows() {
    return axios.get('/api/workflow');
}