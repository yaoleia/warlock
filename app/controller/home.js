'use strict';
const FormData = require('form-data');
module.exports = app => {
  return class IndexController extends app.Controller {
    async login(ctx) {
      await ctx.renderClient('login/login.js', {});
    }
    async home(ctx) {
      // console.log(ctx.get('user-agent'));
      const serverUrl = app.config.serverUrl;
      const url = ctx.url.replace(/\/index/, '');
      await ctx.render('home/home.js', {
        ctx,
        url,
        serverUrl
      });
    }
    async list(ctx) {
      const body = ctx.request.body;
      this.ctx.body = await ctx.service.record.getRecordList(body);
    }

    async add(ctx) {
      ctx.body = this.service.article.saveArticle(ctx.request.body);
    }
    async del(ctx) {
      const { id } = ctx.params;
      ctx.body = this.service.article.deleteArticle(id);
    }
    async detail(ctx) {
      const id = ctx.query.id;
      ctx.body = {};
    }
    async usb(ctx) {
      const body = ctx.request.body;
      ctx.body = await this.service.hardware.setUsbCam(body);
    }
    async main(ctx) {
      const body = ctx.request.body;
      ctx.body = await this.service.hardware.setMainCam(body);
    }

    async light(ctx) {
      const body = ctx.request.body;
      ctx.body = await this.service.hardware.setLight(body);
    }

    async trigger(ctx) {
      const body = ctx.request.body;
      ctx.body = await this.service.hardware.setTrigger(body);
    }

    async tonce(ctx) {
      const serverUrl = app.config.serverUrl;
      const form = new FormData();
      form.append('data', 0);
      const resp = await new Promise((resolve, reject) => {
        form.submit(`${serverUrl}/detect/LaserTriggerTriggerOnce`, function (
          err,
          res
        ) {
          resolve(res);
        });
      });
      ctx.body = resp;
    }
  };
};
