module.exports = app => {
	return function* (next) {
        console.log(this.io)
		// this.socket.emit('res', 'connected!');
		yield* next;
		// execute when disconnect.
		console.log('disconnection!');
	};
};