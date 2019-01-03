import axios from 'framework/network/request';

export function getPlugins(store) {
    return axios.get('/api/plugin', store);
}

export function postPluginAction(serverUrl) {
    return '/api/proxyurl?url=' + serverUrl + '/api/plugin';
}

export function deletePlugin(plugin_id) {
    return axios.delete(`/api/plugin/${plugin_id}`);
}
