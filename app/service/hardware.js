const Service = require('egg').Service;

class hardwareService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.serverUrl = this.app.config.serverUrl;
  }

  async start(json) {
    try {
      const result = await this.app.curl(`${this.serverUrl}/api/control/start_img_processing`, {
        method: 'GET',
        dataType: 'json',
        timeout: 20000
      });
      return result.data;
    } catch (error) {
      return error;
    }
  }

  async stop(json) {
    try {
      const result = await this.app.curl(`${this.serverUrl}/api/control/stop_img_processing`, {
        method: 'GET',
        dataType: 'json',
        timeout: 20000
      });
      return result.data;
    } catch (error) {
      return error;
    }
  }

  async setMainCam(json) {
    try {
      const result = await this.app.curl(`${this.serverUrl}/api/hardware/main_cam`, { method: 'POST', contentType: 'json', data: { ...json }, dataType: 'json', timeout: 20000 });
      return result.data;
    } catch (error) {
      return error;
    }
  }

  async setUsbCam(json) {
    try {
      const result = await this.app.curl(`${this.serverUrl}/api/hardware/usb_cam`, { method: 'POST', contentType: 'json', data: { ...json }, dataType: 'json', timeout: 20000 });
      return result.data;
    } catch (error) {
      return error;
    }
  }

  async setLight(json) {
    try {
      const result = await this.app.curl(`${this.serverUrl}/api/hardware/light`, { method: 'POST', contentType: 'json', data: { ...json }, dataType: 'json', timeout: 20000 });
      return result.data;
    } catch (error) {
      return error;
    }
  }

  async setTrigger(json) {
    try {
      const result = await this.app.curl(`${this.serverUrl}/api/hardware/trigger`, { method: 'POST', contentType: 'json', data: { ...json }, dataType: 'json', timeout: 20000 });
      return result.data;
    } catch (error) {
      return error;
    }
  }
}

module.exports = hardwareService;
