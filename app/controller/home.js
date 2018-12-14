'use strict';
const FormData = require('form-data');
module.exports = app => {
  return class IndexController extends app.Controller {
    async login(ctx) {
      await ctx.renderClient('login/login.js', {});
    }

    async logout(ctx) {
      ctx.logger.info('[account controller] user logout', ctx.session.username);
      ctx.session.username = null;
      ctx.body = 'logout success';
      ctx.redirect('/login');
    }

    async home(ctx) {
      // console.log(ctx.get('user-agent'));
      const serverUrl = app.config.serverUrl;
      const url = ctx.url.replace(/\/index/, '');
      const username = ctx.session.username;
      const resp = {
        ctx,
        url,
        serverUrl
      };
      if (username) {
        resp.username = username;
      }
      await ctx.render('home/home.js', resp);
    }

    async postLogin(ctx) {
      const body = ctx.request.body;
      if (body.username === 'admin' && body.password === 'admin') {
        ctx.session.username = body.username;
        ctx.body = 'success'
      } else {
        ctx.body = 'fail'
      }
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

    async start(ctx) {
      const query = ctx.query;
      ctx.body = await this.service.hardware.start(query);
    }

    async stop(ctx) {
      const query = ctx.query;
      ctx.body = await this.service.hardware.stop(query);
    }

    async tonce(ctx) {
      const serverUrl = app.config.serverUrl;
      const form = new FormData();
      form.append('data', 0);
      const resp = await new Promise((resolve, reject) => {
        form.submit(`${serverUrl}/detect/LaserTriggerTriggerOnce`, function(
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
