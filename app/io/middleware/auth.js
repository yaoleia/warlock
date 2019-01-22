const PREFIX = 'room';
module.exports = app => {
	return async function(ctx, next) {
		const { app, socket, logger, helper } = ctx;
		const id = socket.id;
		const nsp = app.io.of(socket.nsp.name);
		const query = socket.handshake.query;
		// 用户信息
		const { room, userId } = query;
		const rooms = [room];

		logger.debug('#user_info', id, room, userId);

		const tick = (id, msg) => {
			logger.debug('#tick', id, msg);

			// 踢出用户前发送消息
			socket.emit(id, helper.parseMsg('deny', msg));

			// 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
			// socket.disconnect(true)
		};

		const username = ctx.session.username;
		if (!username) {
			// 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
			tick(id, 'auth error')
			return
		}

		// 用户加入
		logger.debug('#join', room);
		socket.join(room);

		// 在线列表
		nsp.adapter.clients(rooms, (err, clients) => {
			logger.debug('#online_join', clients);
		});

		await next();

		// 断开连接同时断开与后端的ws连接
		if (socket.backendClient) {
			socket.backendClient();
			socket.backendClient = null;
		}

		// 用户离开
		logger.debug('#leave', room);

		// 在线列表
		nsp.adapter.clients(rooms, (err, clients) => {
			logger.debug('#online_leave', clients);
		});
	};
};