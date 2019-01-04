const io = require('socket.io-client');
module.exports = app => {
  return async function() {
    const path = this.args[0];
    if (this.socket.ioClient) {
      this.socket.ioClient.close();
      this.socket.ioClient = null
    }

    if (!path) return;

    const serverUrl = app.config.serverUrl;
    const wsServerUrl = `${serverUrl.replace('5000', '5002')}/${path}`;

    if (!this.socket.ioClient) {
      this.socket.ioClient = ioClient(
        wsServerUrl,
        this.socket
      );
      // this.socket.ioClient = setInterval(() => {
      //   let random = Math.random() * 10
      //   this.socket.emit('msg', {
      //     comb_uuid: "a9b64507db0445df98b7da1ed9339b72",
      //     dm_code: `FJW5675789734WTG${random.toFixed(3)}`,
      //     seg_img_path: '/public/mock-img/1.jpg',
      //     mask_img_path: '/public/mock-img/3.jpg',
      //     reg_img_path: '/public/mock-img/2.jpg',
      //     dm_path: '/public/mock-img/dmcode--1538018674.jpg',
      //     defect_type: random > 5 ? 0 : 1,
      //     detect_time: new Date().getTime(),
      //     phone_box: {
      //       point1: { x: 3142, y: 1776 },
      //       point2: { x: 2079, y: 1761 },
      //       point3: { x: 2106, y: -113 },
      //       point4: { x: 3169, y: -98 }
      //     }
      //   });
      // }, 5000);
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
    console.log(message)
    // 转发pusher到warlock前端
    socket.emit('msg', message.data);
  });

  client.on('disconnect', () => {
    console.log('websocket successfully closed');
  });

  client.on('connect_error', () => {
    console.log('==== pusher connect_error! ====');
  });

  socket.on('disconnect', () => {
    console.log(`==== ${socket.id} disconnected ====`);
    client.close();
    client = null;
  });
  return client;
}
