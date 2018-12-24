'use strict';
module.exports = app => {
  return class RecordController extends app.Controller {
    async index(ctx) {
      ctx.body = await ctx.service.task.getTask();
    }
    async create(ctx) {
      ctx.body = await ctx.service.task.creatTask(ctx.request.body);
    }
    async destroy(ctx) {
      ctx.body = await ctx.service.task.deleteTask(ctx.params);
    }
    // async update() {
    //     const { ctx } = this;
    //     this.ctx.body = '修改';
    // }
    async show(ctx) {
      ctx.body = await ctx.service.task.showTask(ctx.params);
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
