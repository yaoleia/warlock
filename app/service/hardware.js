const Service = require('egg').Service;

class hardwareService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.serverUrl = this.app.config.serverUrl;
  }

  async start(json) {
    try {
      const result = await this.ctx.http.get(`${this.serverUrl}/api/control/start_img_processing`);
      return result;
    } catch (error) {
      return error;
    }
  }

  async stop(json) {
    try {
      const result = await this.ctx.http.get(`${this.serverUrl}/api/control/stop_img_processing`);
      return result;
    } catch (error) {
      return error;
    }
  }

  async setMainCam(json) {
    try {
      const result = await this.ctx.http.post(`${this.serverUrl}/api/hardware/main_cam`, { param: { ...json } });
      return result;
    } catch (error) {
      return error;
    }
  }

  async setUsbCam(json) {
    try {
      const result = await this.ctx.http.post(`${this.serverUrl}/api/hardware/usb_cam`, { param: { ...json } });
      return result;
    } catch (error) {
      return error;
    }
  }

  async setLight(json) {
    try {
      const result = await this.ctx.http.post(`${this.serverUrl}/api/hardware/light`, { param: { ...json } });
      return result;
    } catch (error) {
      return error;
    }
  }

  async setTrigger(json) {
    try {
      const result = await this.ctx.http.post(`${this.serverUrl}/api/hardware/trigger`, { param: { ...json } });
      return result;
    } catch (error) {
      return error;
    }
  }
}

module.exports = hardwareService;
