'use strict';
const indexRule = {}
module.exports = app => {
  return class RecordController extends app.Controller {
    async index(ctx) {
      ctx.validate(indexRule, ctx.request.body);
      ctx.body = await ctx.service.record.getRecordList(ctx.request.body);
    }
    // async create() {
    //     const { ctx } = this;
    //     this.ctx.body = '创建';
    // }
    // async destroy() {
    //     const { ctx } = this;
    //     this.ctx.body = '删除';
    // }
    // async update() {
    //     const { ctx } = this;
    //     this.ctx.body = '修改';
    // }
    // async show() {
    //     const { ctx } = this;
    //     this.ctx.body = '查询';
    // }
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
