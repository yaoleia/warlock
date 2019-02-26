module.exports = async app => {
  app.messenger.once('egg-ready', async () => {
    app.redis.on('message', (channel, message) => {
      app.io.of('/').to(channel).emit('msg', JSON.parse(message))
      console.log(channel + ": " + message);
    })
  });

  const serverUrl = app.config.serverUrl;
  let tasks = await app.curl(`${serverUrl}/api/tasks`, {
    method: 'GET',
    dataType: 'json'
  });
  tasks.data.forEach(element => {
    app.redis.subscribe(element.task_id);
  });
};