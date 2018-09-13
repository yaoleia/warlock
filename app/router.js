
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.get('/client', controller.home.client);
    router.get('/pager', controller.home.pager);
    router.get('/history(/.+)?', controller.home.history);
    router.get('/api/proxyurl', controller.proxy.proxyUrl);
};
