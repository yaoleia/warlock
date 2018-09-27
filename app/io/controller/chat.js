const io = require('socket.io-client');
const WebSocket = require('websocket');
const WebSocketClient = WebSocket.client;
module.exports = app => {
  return async function() {
    const message = this.args[0];
    const serverUrl = app.config.serverUrl;

    // console.log(this.socket)
    // wsClient("ws://ws.test.nemoface.com/wsconnect?appkey=3f2cf74b-2228-473e-850d-85d0cc019e18&appsecret=f853f869-594b-4546-8552-65230a33362b&debug=true", this.socket, "ak")
    if (!this.socket.ioClient) {
      this.socket.ioClient = ioClient(
        `${serverUrl}/detect_push`,
        this.socket,
        'ak'
      );
      // this.socket.ioClient = setInterval(() => {
      //   this.socket.emit('msg', {
      //     dm_code: 'FJW5675789734WTG',
      //     seg_img_path: '/img/1.jpg',
      //     mask_img_path: '/img/3.jpg',
      //     reg_img_path: 'http://127.0.0.1:7001/img/2.jpg',
      //     dm_code_path: 'http://127.0.0.1:7001/img/dmcode--1538018674.jpg',
      //     defect_type: 0,
      //     timestamp: new Date().getTime()
      //   });
      // }, 3000);
    }

    this.socket.emit('res', `Hi! I've got your message: ${message}`);
  };
};

function wsClient(addr, socket, ak) {
  let client = new WebSocketClient(); // 实例event-pusher的ws
  client.on('connectFailed', error => {
    console.log('event-pusher Connect Error: ' + error.toString());
    client = null;
    setTimeout(() => {
      wsClient(addr, socket, ak);
    }, 2000);
  });
  client.on('connect', connection => {
    // 连接event-pusher的ws
    console.log(`${addr} ${socket.id} connect!`);
    connection.on('message', message => {
      // 转发event-pusher到retail前端
      const msg = JSON.parse(message.utf8Data);
      socket.emit('msg', msg);
    });

    connection.on('error', error => {
      console.log('event-pusher Connection Error: ' + error.toString());
      setTimeout(() => {
        wsClient(addr, socket, ak);
      }, 2000);
    });

    connection.on('close', () => {
      console.log('event-pusher Connection Closed');
      if (!socket.disconnected) {
        wsClient(addr, socket, ak);
      }
    });

    socket.on('disconnect', () => {
      // retail断开连接 从此ak的房间移除
      console.log(`${socket.id} disconnected`);
      connection.close();
      client = null;
      socket.leave(ak, () => {
        console.log(`${socket.id} client leaves ${ak} room`);
      });
    });
  });
  client.connect(addr);
}

function ioClient(addr, socket, ak) {
  let client = io(addr); // 实例event-pusher的ws
  client.on('connect', () => {
    console.log(`${addr} ${socket.id} connect!`);
  });

  client.on('server_response', message => {
    // 转发event-pusher到retail前端
    socket.emit('msg', message.data);
  });

  client.on('disconnect', () => {
    console.log('websocket successfully closed');
  });

  socket.on('disconnect', () => {
    // retail断开连接 从此ak的房间移除
    console.log(`${socket.id} disconnected`);
    client.close();
    client = null;
    socket.leave(ak, () => {
      console.log(`${socket.id} client leaves ${ak} room`);
    });
  });
  return client;
}
