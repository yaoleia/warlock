module.exports = async app => {
  app.sessionStore = {
    async get(key) {
      const res = await app.redis.get(key);
      if (!res) return null;
      return JSON.parse(res);
    },

    async set(key, value, maxAge) {
      // maxAge not present means session cookies
      // we can't exactly know the maxAge and just set an appropriate value like one day
      if (!maxAge) maxAge = 24 * 60 * 60 * 1000;
      value = JSON.stringify(value);
      await app.redis.set(key, value, 'PX', maxAge);
    },

    async destroy(key) {
      await app.redis.del(key);
    },
  };

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

  Array.isArray(tasks.data) && tasks.data.forEach(element => {
    if (!element.task_flag) return;
    app.redis.subscribe(element.task_id);
  });
};