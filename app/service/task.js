'use strict';
const egg = require('egg');
module.exports = class ArticeService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.serverUrl = this.app.config.serverUrl;
  }

  async getTasks() {
    const tasks = await this.app.curl(`${this.serverUrl}/api/tasks`, { method: 'GET', dataType: 'json', timeout: 20000 });
    return tasks.data;
  }

  async getTaskId() {
    const task = await this.app.curl(`${this.serverUrl}/api/task`, { method: 'GET', dataType: 'json', timeout: 20000 });
    return task.data;
  }

  async creatTask(workflow) {
    try {
      const workflow_id = workflow._id;
      const task_id = await this.ctx.service.task.getTaskId();
      let res = null;
      if (workflow.flowData && !workflow_id) {
        // 创建testTask时使用
        await this.app.curl(`${this.serverUrl}/api/task`, {
          method: 'POST',
          contentType: 'json',
          data: { flowData: workflow.flowData, task_id },
          dataType: 'json',
          timeout: 20000
        });
        res = task_id;
      } else {
        const resp = await this.app.curl(`${this.serverUrl}/api/task`, {
          method: 'POST',
          contentType: 'json',
          data: { workflow_id, task_id },
          dataType: 'json',
          timeout: 20000
        });

        console.log('task_resp: ' + JSON.stringify(resp.data))

        // TODO: 开启错误
        if (!resp.data.task_flag) {
          this.ctx.status = 400;
          return resp.data;
        }
        workflow.active = true;
        workflow.task_id = task_id;
        await this.ctx.service.workflow.updateWorkflow(workflow);
        res = workflow;
      }

      const tid = res.task_id ? res.task_id : res;
      console.log('task_id: ' + JSON.stringify(tid))
      if (typeof tid === 'string') {
        this.app.redis.get('subClient').subscribe(tid);
      }
      return res;
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(params) {
    let res = params.task_id;
    try {
      if (res) {
        await this.app.curl(`${this.serverUrl}/api/task/${res} `);
        this.app.redis.get('subClient').unsubscribe(res);
      } else {
        const workflow = await this.ctx.service.workflow.getWorkflow({ id: params.id })
        await this.app.curl(`${this.serverUrl}/api/task/${workflow.task_id}`, {
          method: 'DELETE',
          timeout: 20000
        });
        this.app.redis.get('subClient').unsubscribe(workflow.task_id);
        workflow.active = false;
        workflow.task_id = '';
        await this.ctx.service.workflow.updateWorkflow(workflow);
        res = workflow;
      }
      return res;
    } catch (error) {
      throw error;
    }
  }

  async showTask(params) {
    try {
      const resp = await this.app.curl(`${this.serverUrl}/api/task/${params.id}`, {
        method: 'GET',
        dataType: 'json',
        timeout: 20000
      });
      return resp.data;
    } catch (error) {
      throw error;
    }
  }

};
