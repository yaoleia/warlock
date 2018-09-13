'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.home);
  router.get('/index(/.+)?', controller.home.home);
  router.get('/login', controller.home.login);
  router.post('/api/article/list', controller.home.list);
  router.post('/api/article/add', controller.home.add);
  router.get('/api/article/del/:id', controller.home.del);
  router.get('/api/article/:id', controller.home.detail);
  router.get('/api/proxyurl', controller.proxy.proxyUrl);
};