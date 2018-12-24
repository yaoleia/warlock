'use strict';
const egg = require('egg');
module.exports = class ArticeService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.serverUrl = this.app.config.serverUrl;
  }
  async getTask() {
    const task = await this.app.curl(`${this.serverUrl}/api/task`, { method: 'GET', dataType: 'json' });
    return task;
  }

  async creatTask(body) {
    try {
      const resp = await this.ctx.http.post(`${this.serverUrl}/api/task`, body);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(params) {
    try {
      const resp = await this.ctx.http.delete(`${this.serverUrl}/api/task/${params.id}`);
      console.log(resp)
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async showTask(params) {
    try {
      const resp = await this.ctx.http.get(`${this.serverUrl}/api/task/${params.id}`);
      console.log(resp)
      return resp;
    } catch (error) {
      throw error;
    }
  }

};