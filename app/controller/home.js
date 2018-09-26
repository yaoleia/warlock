'use strict';
const FormData = require('form-data');
module.exports = app => {
  return class IndexController extends app.Controller {
    async login(ctx) {
      await ctx.renderClient('login/login.js', {});
    }
    async home(ctx) {
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
      const serverUrl = app.config.serverUrl;
      // this.ctx.body = ctx.service.article.getArtilceList(body);
      let reqObj = null;
      if (body.endTime) {
        reqObj = {
          limit: body.pageSize,
          offset: (body.pageIndex - 1) * body.pageSize,
          end_time: body.endTime
        };
        if (body.dateRange) {
          reqObj.start_time = body.dateRange[0];
          if (body.endTime > body.dateRange[1]) {
            reqObj.end_time = body.dateRange[1];
          }
        }
      } else {
        reqObj = {
          limit: 20,
          offset: 0,
          end_time: new Date().getTime()
        };
      }

      console.log(body, reqObj);
      // const p1 = this.ctx.http.post(`${serverUrl}/record_size`, reqObj);
      // const p2 = this.ctx.http.post(`${serverUrl}/record`, reqObj);
      // const resp = await Promise.all([p1, p2]);
      // this.ctx.body = resp;
      this.ctx.body = {
        total: 32,
        list: [
          {
            dm_code: 'FJW5675789734WTG',
            seg_img_path: '/img/1.jpg',
            reg_img_path: '/img/2.jpg',
            mask_img_path: '/img/3.jpg',
            defect_type: 0,
            timestamp: new Date().getTime()
          },
          {
            dm_code: 'FJW5675789734WTG',
            seg_img_path: '/img/1.jpg',
            mask_img_path: '/img/3.jpg',
            reg_img_path: '/img/2.jpg',
            defect_type: 1,
            timestamp: new Date().getTime()
          },
          {
            dm_code: 'FJW5675789734WTG',
            seg_img_path: '/img/1.jpg',
            mask_img_path: '/img/3.jpg',
            reg_img_path: '/img/2.jpg',
            defect_type: 2,
            timestamp: new Date().getTime()
          }
        ]
      };
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
      const data = ctx.request.body;
      const form = new FormData();
      form.append(
        'data',
        JSON.stringify({
          num: data.b
        })
      );
      const resp = await new Promise((resolve, reject) => {
        form.submit(`${serverUrl}/USBCam_exposure`, function(err, res) {
          resolve(res);
        });
      });
      ctx.body = resp;
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
          formb.submit(`${serverUrl}/mainCam_exposure`, function(err, res) {
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
          formz.submit(`${serverUrl}/mainCam_gain`, function(err, res) {
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
          formg.submit(`${serverUrl}/mainCam_gamma`, function(err, res) {
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
          forml.submit(`${serverUrl}/lightBright`, function(err, res) {
            resolve(res);
          });
        });
      }
      if (data.on) {
        const formon = new FormData();
        formon.append('data', data.on);
        respon = new Promise((resolve, reject) => {
          formon.submit(
            data.on == '1' ? `${serverUrl}/lightOn` : `${serverUrl}/lightOff`,
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
        form.submit(`${serverUrl}/LaserTriggerTriggerOnce`, function(err, res) {
          resolve(res);
        });
      });
      ctx.body = resp;
    }
  };
};
