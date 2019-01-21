module.exports = app => {
  return async function() {
    const msg = this.args[0];
    const nsp = app.io.of(this.socket.nsp.name);
    nsp.emit('workflow', msg)
  };
};