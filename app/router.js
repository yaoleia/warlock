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
  router.get('/api/start', controller.home.start);
  router.get('/api/stop', controller.home.stop);
  router.post('/api/usb', controller.home.usb);
  router.post('/api/main', controller.home.main);
  router.post('/api/light', controller.home.light);
  router.post('/api/trigger', controller.home.trigger);
  router.post('/api/tonce', controller.home.tonce);
  app.io.route('chat', app.io.controller.chat);
};
