const io = require('socket.io-client');
module.exports = app => {
  return async function() {
    const taskId = this.args[0];
    if (this.socket.backendClient) {
      this.socket.backendClient();
      this.socket.backendClient = null
    }

    if (!taskId) return;

    const serverUrl = app.config.serverUrl;

    if (!this.socket.backendClient) {
      this.socket.backendClient = ioClient(
        serverUrl,
        taskId,
        this.socket
      );
    }

    this.socket.emit('res', `Hi! I've got your message: ${taskId}`);
  };
};

function ioClient(addr, taskId, socket) {
  let client = io(addr); // 实例pusher的ws

  client.on('server_response', message => {
    // 转发pusher到warlock前端
    console.log(JSON.stringify(message))
    socket.emit('msg', message.data);
  });


  client.on('connect', () => {
    client.emit('join', { task_id: taskId })
    console.log(`==== ${addr} ${client.id} connect ${taskId} success ! ====`);
  });

  client.on('disconnect', () => {
    client.off('connect_error')
    client.close();
    client = null;
    console.log('websocket successfully closed');
  });

  client.on('connect_error', () => {
    console.log('==== pusher connect_error! ====');
  });

  return function() {
    if (client) {
      client.disconnect();
    }
  };
}
