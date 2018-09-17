module.exports = app => {
	return function* () {
        const message = this.args[0];
		console.log(message);
		// console.log(this.socket)
		this.socket.emit('res', `Hi! I've got your message: ${message||123}`);
	};
};