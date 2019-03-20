module.exports = app => {
  return async function() {
    const msg = this.args[0];
    this.socket.join(msg)
  };
};
