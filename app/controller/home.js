module.exports = app => {

  return class HomeController extends app.Controller {
    async index() {
      const serverUrl = app.config.serverUrl;

      const { ctx } = this;
      await ctx.render('home/index.js', { serverUrl });
    }

    async client() {
      const serverUrl = app.config.serverUrl;

      const { ctx } = this;
      await ctx.renderClient('home/index.js', { serverUrl });
    }

    async history() {
      const serverUrl = app.config.serverUrl;

      const { ctx } = this;
      await ctx.render('history/index.js', { serverUrl });
    }

    async pager() {
      const { ctx } = this;
      const pageIndex = ctx.query.pageIndex;
      const pageSize = ctx.query.pageSize;
      ctx.body = 123;
    }

  };
};
