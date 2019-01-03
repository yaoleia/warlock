const Service = require('egg').Service;

class WorkflowService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.serverUrl = this.app.config.serverUrl;
  }
  async getWorkflowList() {
    try {
      const resp = await this.ctx.http.get(`${this.serverUrl}/api/workflows`);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkflow(params) {
    try {
      const resp = await this.ctx.http.delete(`${this.serverUrl}/api/workflow/${params.id}`);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async getWorkflow(params) {
    try {
      const resp = await this.ctx.http.get(`${this.serverUrl}/api/workflow/${params.id}`);
      return resp;
    } catch (error) {
      throw error;
    }
  }
  async creatWorkflow(body) {
    try {
      const resp = await this.ctx.http.post(`${this.serverUrl}/api/workflow`, body);
      return resp;
    } catch (error) {
      throw error;
    }
  }
  async updateWorkflow(body) {
    try {
      const resp = await this.ctx.http.post(`${this.serverUrl}/api/workflow/${body._id}`, body);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WorkflowService;
