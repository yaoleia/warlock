const io = require('socket.io-client');
module.exports = app => {
  return async function() {
    const message = this.args[0];
    const serverUrl = app.config.serverUrl;
    if (!this.socket.ioClient) {
      this.socket.ioClient = ioClient(
        `${serverUrl}/detect_push`,
        this.socket,
        'ak'
      );
      this.socket.ioClient = setInterval(() => {
        this.socket.emit('msg', {
          dm_code: 'FJW5675789734WTG',
          seg_img_path: '/img/1.jpg',
          mask_img_path: '/img/3.jpg',
          reg_img_path: 'http://127.0.0.1:7001/img/2.jpg',
          dm_code_path: 'http://127.0.0.1:7001/img/dmcode--1538018674.jpg',
          defect_type: 0,
          timestamp: new Date().getTime()
        });
      }, 3000);
    }

    this.socket.emit('res', `Hi! I've got your message: ${message}`);
  };
};

function ioClient(addr, socket, ak) {
  let client = io(addr); // 实例detect_push的ws
  client.on('connect', () => {
    console.log(`==== ${addr} ${socket.id} connect! ====`);
  });

  client.on('server_response', message => {
    // 转发detect_push到warlock前端
    socket.emit('msg', message.data);
  });

  client.on('disconnect', () => {
    console.log('websocket successfully closed');
  });

  client.on('connect_error', () => {
    console.log('==== detect_push connect_error! ====');
  });

  socket.on('disconnect', () => {
    // warlock断开连接 从此ak的房间移除
    console.log(`==== ${socket.id} disconnected ====`);
    client.close();
    client = null;
    socket.leave(ak, () => {
      // console.log(`${socket.id} client leaves ${ak} room`);
    });
  });
  return client;
}
