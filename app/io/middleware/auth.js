module.exports = app => {
	return async function (ctx, next) {
        // ctx.socket.join(room);
        // let nsp = app.io.of('/')
		// this.socket.emit('res', 'connected!');
		await next();
		// execute when disconnect.
		console.log('disconnection!');
	};
};