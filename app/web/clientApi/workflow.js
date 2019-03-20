import axios from 'framework/network/request';

export function patchWorkflow(_id, json) {
  return axios.patch(`/api/workflow/${_id}`, json);
}

export function postWorkflow(json) {
  return axios.post('/api/workflow', json);
}

export function getWorkflowById(_id) {
  return axios.get(`/api/workflow/${_id}`);
}

export function deleteWorkflow(_id) {
  return axios.delete(`/api/workflow/${_id}`);
}

export function getWorkflows() {
  return axios.get('/api/workflow');
}
