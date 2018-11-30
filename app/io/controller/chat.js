const io = require('socket.io-client');
module.exports = app => {
  return async function() {
    const message = this.args[0];
    const serverUrl = app.config.serverUrl;
    if (!this.socket.ioClient) {
      this.socket.ioClient = ioClient(
        `${serverUrl}/detect_push`,
        this.socket,
        'ak', serverUrl
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

    this.socket.emit('res', `Hi! I've got your message: ${message}`);
  };
};

function ioClient(addr, socket, ak, serverUrl) {
  let client = io(addr); // 实例detect_push的ws
  client.on('connect', () => {
    console.log(`==== ${addr} ${socket.id} connect! ====`);
  });

  client.on('server_response', message => {
    // 转发detect_push到warlock前端
    for (const attr in message.data) {
      if (attr.indexOf('_path') !== -1) {
        message.data[attr] = message.data[attr].replace('http://0.0.0.0:5001', serverUrl).replace('5000', '5001');
      }
    }
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
