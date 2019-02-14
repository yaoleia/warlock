'use strict';
module.exports = app => {
  return class RecordController extends app.Controller {
    async index(ctx) {
      ctx.body = await ctx.service.task.getTasks();
    }
    async create(ctx) {
      ctx.body = await ctx.service.task.creatTask(ctx.request.body);
    }
    async destroy(ctx) {
      ctx.body = await ctx.service.task.deleteTask(ctx.params);
    }
    async deleteTestTask(ctx) {
      ctx.body = await ctx.service.task.deleteTask({ task_id: ctx.params.id });
    }
    // async update() {
    //     const { ctx } = this;
    //     this.ctx.body = '修改';
    // }
    async show(ctx) {
      ctx.body = await ctx.service.task.showTask(ctx.params);
    }
    async new(ctx) {
      ctx.body = await ctx.service.task.getTaskId();
    }
    // async edit() {
    //     const { ctx } = this;
    //     this.ctx.body = '修改页面';
    // }
  };
};
