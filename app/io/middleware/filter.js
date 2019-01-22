module.exports = app => {
  return async function(ctx, next) {
    ctx.socket.emit('res', 'packet received!');
    // console.log('packet:', ctx.packet);
    await next();
  };
};
