'use strict';
const egg = require('egg');
module.exports = class ArticeService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.serverUrl = this.app.config.serverUrl;
  }

  async getTasks() {
    const tasks = await this.app.curl(`${this.serverUrl}/api/tasks`, { method: 'GET', dataType: 'json' });
    return tasks.data;
  }

  async getTaskId() {
    const task = await this.app.curl(`${this.serverUrl}/api/task`, { method: 'GET', dataType: 'json' });
    return task.data;
  }

  async creatTask(workflow) {
    try {
      const workflow_id = workflow._id;
      const task_id = await this.ctx.service.task.getTaskId();
      if (workflow.flowData && !workflow_id) {
        // 创建testTask时使用
        await this.ctx.http.post(`${this.serverUrl}/api/task`, { flowData: workflow.flowData, task_id });
        return task_id;
      }
      const resp = await this.ctx.http.post(`${this.serverUrl}/api/task`, { workflow_id, task_id });

      // TODO: 开启错误
      if (!resp.task_flag) {
        this.ctx.status = 400;
        return resp;
      }
      workflow.active = true;
      workflow.task_id = task_id;
      await this.ctx.service.workflow.updateWorkflow(workflow);
      return workflow;
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(params) {
    try {
      if (params.task_id) {
        const resp = await this.ctx.http.delete(`${this.serverUrl}/api/task/${params.task_id} `);
        return resp;
      }
      const workflow = await this.ctx.service.workflow.getWorkflow({ id: params.id })
      await this.ctx.http.delete(`${this.serverUrl}/api/task/${workflow.task_id}`);
      workflow.active = false;
      workflow.task_id = '';
      await this.ctx.service.workflow.updateWorkflow(workflow);
      return workflow;
    } catch (error) {
      throw error;
    }
  }

  async showTask(params) {
    try {
      const resp = await this.ctx.http.get(`${this.serverUrl}/api/task/${params.id}`);
      return resp;
    } catch (error) {
      throw error;
    }
  }

};