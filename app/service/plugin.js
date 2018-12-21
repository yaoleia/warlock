const Service = require('egg').Service;
const sendToWormhole = require('stream-wormhole');

class PluginService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.serverUrl = this.app.config.serverUrl;
  }
  async getPluginList() {
    try {
      const resp = await this.ctx.http.get(`${this.serverUrl}/api/plugins`);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async deletePlugin(params) {
    try {
      const resp = await this.ctx.http.delete(`${this.serverUrl}/api/plugin/${params.id}`);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async getPlugin(params) {
    try {
      const resp = await this.ctx.http.get(`${this.serverUrl}/api/plugin/${params.id}`);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async createPlugin(ctx) {
    let stream;
    try {
      stream = await ctx.getFileStream();
      const resp = await this.app.curl(`${this.serverUrl}/api/plugin`, {
        method: 'POST',
        stream
      });
      return resp;
    } catch (error) {
      await sendToWormhole(stream);
      throw error;
    }
  }
}

module.exports = PluginService;
