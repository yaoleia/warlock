'use strict';
const indexRule = {}
module.exports = app => {
  return class WorkflowController extends app.Controller {
    async index(ctx) {
      ctx.body = await ctx.service.workflow.getWorkflowList();
    }
    async create(ctx) {
      ctx.body = await ctx.service.workflow.creatWorkflow(ctx.request.body);
    }
    async destroy(ctx) {
      ctx.body = await ctx.service.workflow.deleteWorkflow(ctx.params);
    }
    async update(ctx) {
      ctx.body = await ctx.service.workflow.updateWorkflow(ctx.request.body);
    }
    async show(ctx) {
      ctx.body = await ctx.service.workflow.getWorkflow(ctx.params);
    }
  };
};
