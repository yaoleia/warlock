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
    async assist(ctx) {
      const serverUrl = app.config.serverUrl;
      const { b } = ctx.request.body;

      const result = await ctx.curl(`${serverUrl}/detect/USBCam_exposure`, {
        method: 'POST',
        // 不需要设置 contentType，HttpClient 会默认以 application/x-www-form-urlencoded 格式发送请求
        data: {
          data: JSON.stringify({ num: b })
        }
      });
      ctx.body = result.data;
    }
    async main(ctx) {
      const serverUrl = app.config.serverUrl;
      const data = ctx.request.body;
      let respb,
        respz,
        respg;
      if (data.b) {
        const formb = new FormData();
        formb.append(
          'data',
          JSON.stringify({
            num: data.b
          })
        );
        respb = new Promise((resolve, reject) => {
          formb.submit(`${serverUrl}/detect/mainCam_exposure`, function(
            err,
            res
          ) {
            resolve(res);
          });
        });
      }

      if (data.z) {
        const formz = new FormData();
        formz.append(
          'data',
          JSON.stringify({
            num: data.z
          })
        );
        respz = new Promise((resolve, reject) => {
          formz.submit(`${serverUrl}/detect/mainCam_gain`, function(err, res) {
            resolve(res);
          });
        });
      }

      if (data.g) {
        const formg = new FormData();
        formg.append(
          'data',
          JSON.stringify({
            num: data.g
          })
        );
        respg = new Promise((resolve, reject) => {
          formg.submit(`${serverUrl}/detect/mainCam_gamma`, function(err, res) {
            resolve(res);
          });
        });
      }

      const p = await Promise.all([respb, respz, respg]);
      ctx.body = 'OK';
    }

    async light(ctx) {
      const serverUrl = app.config.serverUrl;
      const data = ctx.request.body;
      let respl,
        respon;
      if (data.l) {
        const forml = new FormData();
        forml.append(
          'data',
          JSON.stringify({
            num: data.l
          })
        );
        respl = new Promise((resolve, reject) => {
          forml.submit(`${serverUrl}/detect/lightBright`, function(err, res) {
            resolve(res);
          });
        });
      }
      if (data.on) {
        const formon = new FormData();
        formon.append('data', data.on);
        respon = new Promise((resolve, reject) => {
          formon.submit(
            data.on == '1'
              ? `${serverUrl}/detect/lightOn`
              : `${serverUrl}/lightOff`,
            function(err, res) {
              resolve(res);
            }
          );
        });
      }
      const p = await Promise.all([respl, respon]);
      ctx.body = 'OK';
    }

    async laser(ctx) {
      const serverUrl = app.config.serverUrl;
      const data = ctx.request.body;
      const form = new FormData();
      let url = '';
      if (data.t == '1') {
        url = `${serverUrl}/ModeLaserTrigger`;
      } else if (data.t == '2') {
        url = `${serverUrl}/ModeRandomTrigger`;
      } else if (data.t == '3') {
        url = `${serverUrl}/ModeManualTrigger`;
      }
      form.append('data', 0);
      const resp = await new Promise((resolve, reject) => {
        form.submit(url, function(err, res) {
          resolve(res);
        });
      });
      ctx.body = resp;
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
