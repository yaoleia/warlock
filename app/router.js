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
  router.post('/api/assist', controller.home.assist)
  router.post('/api/main', controller.home.main)
  router.post('/api/light', controller.home.light)
  router.post('/api/laser', controller.home.laser)
  router.post('/api/tonce', controller.home.tonce)
};