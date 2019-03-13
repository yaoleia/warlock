const Service = require('egg').Service;
const sendToWormhole = require('stream-wormhole');
const path = require('path')
const fs = require('mz/fs')
const awaitReadStream = require('await-stream-ready').write;
const FormStream = require('formstream');

class PluginService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.serverUrl = this.app.config.serverUrl;
  }
  async getPluginList() {
    try {
      const resp = await this.app.curl(`${this.serverUrl}/api/plugins`, {
        method: 'GET',
        dataType: 'json',
        timeout: 20000
      });
      return resp.data;
    } catch (error) {
      throw error;
    }
  }

  async deletePlugin(params) {
    try {
      const resp = await this.app.curl(`${this.serverUrl}/api/plugin/${params.id}`, {
        method: 'DELETE',
        dataType: 'json',
        timeout: 20000
      });
      return resp.data;
    } catch (error) {
      throw error;
    }
  }

  async getPlugin(params) {
    try {
      const resp = await this.app.curl(`${this.serverUrl}/api/plugin/${params.id}`, {
        method: 'GET',
        dataType: 'json',
        timeout: 20000
      });
      return resp.data;
    } catch (error) {
      throw error;
    }
  }

  async createPlugin(ctx) {
    let stream,
      target;
    const form = new FormStream();
    // 上传当前文件本身用于测试
    try {
      stream = await ctx.getFileStream();
      const filename = Date.now() + '' + Number.parseInt(Math.random() * 10000) + '_' + stream.filename;
      target = path.join(this.config.baseDir, 'upload', filename);
      const writeStream = fs.createWriteStream(target);
      await awaitReadStream(stream.pipe(writeStream));
      form.file('file', target);

      const resp = await this.app.curl(`${this.serverUrl}/api/plugin`, {
        method: 'POST',
        headers: form.headers(),
        // stream,
        stream: form,
        dataType: 'json',
        timeout: 20000
      });
      return resp.data;
    } catch (error) {
      await sendToWormhole(stream);
      throw error;
    } finally {
      await fs.unlink(target);
    }
  }
}

module.exports = PluginService;
