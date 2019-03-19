const Service = require('egg').Service;

class WorkflowService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.serverUrl = this.app.config.serverUrl;
  }
  async getWorkflowList() {
    try {
      let workflows,
        tasks,
        plugins;
      const p1 = this.app.curl(`${this.serverUrl}/api/workflows`, {
        method: 'GET',
        dataType: 'json',
        timeout: 20000
      }).then(resp => {
        workflows = resp.data;
      })
      const p2 = this.ctx.service.task.getTasks().then(resp => {
        tasks = resp ? resp.filter(t => t.task_flag).map(t => t.task_id) : [];
      })
      const p3 = this.ctx.service.plugin.getPluginList().then(resp => {
        plugins = resp.map(r => r.module)
      })
      await Promise.all([p1, p2, p3])

      // 对获取的workflow进行判断异常
      const promises = workflows.map(async d => {
        // 异常
        // toEmit暂时全部更新
        let toEmit = true;
        if (!d.flowData) {
          d.flowData = { disabled: true };
          return
        }
        d.flowData.disabled = false;
        d.flowData.nodes.forEach(n => {
          if (!plugins.includes(n.shape)) {
            // 准备更新workflow
            if (!toEmit) { toEmit = true }
            n.shape = n.shape + '_delete'
            if (!d.flowData.disabled) {
              d.flowData.disabled = true;
            }
          }
        })
        if (d.task_id) {
          if (!tasks.includes(d.task_id)) {
            d.task_id = '';
            d.active = false;
            await this.ctx.service.workflow.updateWorkflow(d);
            toEmit = false;
          }
        }
        if (toEmit) {
          this.app.io.of('/').emit('workflow', { type: 'update', msg: d });
        }
      })
      await Promise.all(promises);
      workflows.sort((a, b) => b.ts - a.ts);
      return workflows;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkflow(params) {
    try {
      const workflow_id = params.id;
      const workflow = await this.ctx.service.workflow.getWorkflow({ id: workflow_id });
      if (workflow.task_id) {
        await this.app.curl(`${this.serverUrl}/api/task/${workflow.task_id}`, {
          method: 'DELETE',
          timeout: 20000
        });
      }
      const resp = await this.app.curl(`${this.serverUrl}/api/workflow/${workflow_id}`, {
        method: 'DELETE',
        dataType: 'json',
        timeout: 20000
      });
      this.app.io.of('/').emit('workflow', { type: 'delete', msg: { _id: workflow_id } });
      return resp.data;
    } catch (error) {
      throw error;
    }
  }

  async getWorkflow(params) {
    try {
      const resp = await this.app.curl(`${this.serverUrl}/api/workflow/${params.id}`, {
        method: 'GET',
        dataType: 'json',
        timeout: 20000
      });
      return resp.data;
    } catch (error) {
      throw error;
    }
  }
  async creatWorkflow(body) {
    try {
      const resp = await this.app.curl(`${this.serverUrl}/api/workflow`, {
        method: 'POST',
        contentType: 'json',
        data: body,
        dataType: 'json',
        timeout: 20000
      });
      const msg = { ...body, _id: resp.data._id || resp.data };
      this.app.io.of('/').emit('workflow', { type: 'add', msg });
      return msg;
    } catch (error) {
      throw error;
    }
  }
  async updateWorkflow(body) {
    try {
      await this.app.curl(`${this.serverUrl}/api/workflow/${body._id}`, {
        method: 'POST',
        contentType: 'json',
        data: body,
        dataType: 'json',
        timeout: 20000
      });
      this.app.io.of('/').emit('workflow', { type: 'update', msg: body });
      return body;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WorkflowService;
