const WebSocket = require('websocket')
const WebSocketClient = WebSocket.client;
module.exports = app => {
	return function* () {
		const message = this.args[0];
		this.socket.aaa = message
		wsClient("ws://ws.test.nemoface.com/wsconnect?appkey=3f2cf74b-2228-473e-850d-85d0cc019e18&appsecret=f853f869-594b-4546-8552-65230a33362b&debug=true", this.socket, "ak")
		// console.log(this.socket)
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
	client.on('connect', connection => { // 连接event-pusher的ws
		console.log(`${addr} ${socket.id} connect!`)
		connection.on('message', message => {
			// 转发event-pusher到retail前端
			const msg = JSON.parse(message.utf8Data);
			socket.emit("msg", msg);
		})

		connection.on('error', error => {
			console.log("event-pusher Connection Error: " + error.toString());
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

		socket.on("disconnect", () => { // retail断开连接 从此ak的房间移除
			console.log(`${socket.id} disconnected`);
			connection.close();
			client = null;
			socket.leave(ak, () => {
				console.log(`${socket.id} client leaves ${ak} room`);
			});
		})
	})
	client.connect(addr);
}