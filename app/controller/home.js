module.exports = app => {

  return class HomeController extends app.Controller {

    async index() {
      const { ctx } = this;
      await ctx.render('home/index.js');
    }

    async client() {
      const { ctx } = this;
      await ctx.renderClient('home/index.js');
    }

    async pager() {
      const { ctx } = this;
      const pageIndex = ctx.query.pageIndex;
      const pageSize = ctx.query.pageSize;
      ctx.body = 123;
    }

  };
};