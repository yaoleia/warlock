module.exports = async app => {
  app.messenger.once('egg-ready', async () => {
    app.redis.on('message', (channel, message) => {
      app.io.of('/').to(channel).emit('msg', JSON.parse(message))
      console.log(channel + ': ' + message);
    })
  });

  const serverUrl = app.config.serverUrl;
  const tasks = await app.curl(`${serverUrl}/api/tasks`, {
    method: 'GET',
    dataType: 'json',
    timeout: 20000
  });
  tasks.data.forEach(element => {
    if (!element.task_flag) return;
    app.redis.subscribe(element.task_id);
  });
};