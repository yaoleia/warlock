
module.exports = app => {
  app.get('/', app.controller.home.index);
  app.get('/client', app.controller.home.client);
  app.get('/pager', app.controller.home.pager);
  app.get('/history', app.controller.home.history);
  app.get('/api/proxyurl', app.controller.proxy.proxyUrl);
};
