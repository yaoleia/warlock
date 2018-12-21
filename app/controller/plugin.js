'use strict';
const indexRule = {}
module.exports = app => {
  return class PluginController extends app.Controller {
    async index(ctx) {
      ctx.body = await ctx.service.plugin.getPluginList();
    }
    async create(ctx) {
      ctx.body = await ctx.service.plugin.createPlugin(ctx);
    }
    async destroy(ctx) {
      ctx.body = await ctx.service.plugin.deletePlugin(ctx.params);
    }
    async show(ctx) {
      ctx.body = await ctx.service.plugin.getPlugin(ctx.params);
    }
    // async new() {
    //     const { ctx } = this;
    //     this.ctx.body = '创建页面';
    // }
    // async edit() {
    //     const { ctx } = this;
    //     this.ctx.body = '修改页面';
    // }
  };
};
