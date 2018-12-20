'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.home);
  router.get('/index(/.+)?', controller.home.home);
  router.get('/login', controller.home.login);
  router.get('/logout', controller.home.logout);
  router.post('/api/login', controller.home.postLogin);
  router.post('/api/upload', controller.home.upload);

  // 历史记录
  router.resources('record', '/api/record', controller.record);

  router.get('/api/start', controller.home.start);
  router.get('/api/stop', controller.home.stop);
  router.post('/api/usb', controller.home.usb);
  router.post('/api/main', controller.home.main);
  router.post('/api/light', controller.home.light);
  router.post('/api/trigger', controller.home.trigger);
  router.post('/api/tonce', controller.home.tonce);
  app.io.route('chat', app.io.controller.chat);
};
