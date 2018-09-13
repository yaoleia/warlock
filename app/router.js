'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/login', controller.admin.login);
  router.post('/admin/api/article/list', controller.admin.list);
  router.post('/admin/api/article/add', controller.admin.add);
  router.get('/admin/api/article/del/:id', controller.admin.del);
  router.get('/admin/api/article/:id', controller.admin.detail);
  router.get('/admin(/.+)?', controller.admin.home);
  router.get('/api/proxyurl', controller.proxy.proxyUrl);
};