const io = require('socket.io-client');
module.exports = app => {
  return async function() {
    const path = this.args[0];
    if (this.socket.backendClient) {
      this.socket.backendClient();
      this.socket.backendClient = null
    }

    if (!path) return;

    const serverUrl = app.config.serverUrl;
    const wsServerUrl = `${serverUrl.replace('5000', '5002')}/${path}`;

    if (!this.socket.backendClient) {
      this.socket.backendClient = ioClient(
        wsServerUrl,
        this.socket
      );
    }

    this.socket.emit('res', `Hi! I've got your message: ${path}`);
  };
};

function ioClient(addr, socket) {
  let client = io(addr); // 实例pusher的ws
  client.on('connect', () => {
    console.log(`==== ${addr} ${socket.id} connect! ====`);
  });

  client.on('server_response', message => {
    // 转发pusher到warlock前端
    socket.emit('msg', message.data);
    console.log(JSON.stringify(message))
  });

  client.on('connect_error', () => {
    console.log('==== pusher connect_error! ====');
  });

  client.on('disconnect', () => {
    client.off('connect_error')
    client.close();
    client = null;
    console.log('websocket successfully closed');
  });

  return function() {
    if (client) {
      client.disconnect();
    }
  };
}
