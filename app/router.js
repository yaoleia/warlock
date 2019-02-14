'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.home);
  router.get('/index(/.+)?', controller.home.home);
  router.get('/login', controller.home.login);
  router.get('/logout', controller.home.logout);
  router.post('/api/login', controller.home.postLogin);

  // 历史记录
  router.resources('record', '/api/record', controller.record);

  // 插件
  router.resources('plugin', '/api/plugin', controller.plugin);

  // workflow设计
  router.resources('workflow', '/api/workflow', controller.workflow);

  // task任务
  router.resources('task', '/api/task', controller.task);

  // 删除测试的task
  router.delete('/api/testtask/:id', controller.task.deleteTestTask)

  router.get('/api/start', controller.home.start);
  router.get('/api/stop', controller.home.stop);
  router.post('/api/usb', controller.home.usb);
  router.post('/api/main', controller.home.main);
  router.post('/api/light', controller.home.light);
  router.post('/api/trigger', controller.home.trigger);
  router.post('/api/tonce', controller.home.tonce);
  app.io.of('/').route('chat', app.io.controller.chat);
  app.io.of('/').route('workflow', app.io.controller.workflow);
};
