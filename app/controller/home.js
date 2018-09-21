'use strict';
var FormData = require('form-data');
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
			this.ctx.body = ctx.service.article.getArtilceList(ctx.request.body);
		}
		async add(ctx) {
			ctx.body = this.service.article.saveArticle(ctx.request.body);
		}
		async del(ctx) {
			const {
				id
			} = ctx.params;
			ctx.body = this.service.article.deleteArticle(id);
		}
		async detail(ctx) {
			const id = ctx.query.id;
			ctx.body = {};
		}
		async assist(ctx) {
			const serverUrl = app.config.serverUrl;
			const data = ctx.request.body;
			let form = new FormData()
			form.append("data", JSON.stringify({
				num: data.b
			}))
			let resp = await new Promise((resolve, reject) => {
				form.submit(`${serverUrl}/USBCam_exposure`, function (err, res) {
					resolve(res)
				});
			})
			ctx.body = resp
		}
		async main(ctx) {
			const serverUrl = app.config.serverUrl;
			const data = ctx.request.body;
			let respb, respz, respg;
			if (data.b) {
				let formb = new FormData()
				formb.append("data", JSON.stringify({
					num: data.b
				}))
				respb = new Promise((resolve, reject) => {
					formb.submit(`${serverUrl}/mainCam_exposure`, function (err, res) {
						resolve(res)
					});
				})
			}

			if (data.z) {
				let formz = new FormData()
				formz.append("data", JSON.stringify({
					num: data.z
				}))
				respz = new Promise((resolve, reject) => {
					formz.submit(`${serverUrl}/mainCam_gain`, function (err, res) {
						resolve(res)
					});
				})
			}

			if (data.g) {
				let formg = new FormData()
				formg.append("data", JSON.stringify({
					num: data.g
				}))
				respg = new Promise((resolve, reject) => {
					formg.submit(`${serverUrl}/mainCam_gamma`, function (err, res) {
						resolve(res)
					});
				})
			}

			let p = await Promise.all([respb, respz, respg])
			ctx.body = "OK";
		}

		async light(ctx) {
			const serverUrl = app.config.serverUrl;
			const data = ctx.request.body;
			let respl, respon;
			if (data.l) {
				let forml = new FormData()
				forml.append("data", JSON.stringify({
					num: data.l
				}))
				respl = new Promise((resolve, reject) => {
					forml.submit(`${serverUrl}/lightBright`, function (err, res) {
						resolve(res)
					});
				})
			}
			if (data.on) {
				let formon = new FormData()
				formon.append("data", data.on)
				respon = new Promise((resolve, reject) => {
					formon.submit(data.on == "1" ? `${serverUrl}/lightOn` : `${serverUrl}/lightOff`, function (err, res) {
						resolve(res)
					});
				})
			}
			let p = await Promise.all([respl, respon])
			ctx.body = "OK"
		}

		async laser(ctx) {
			const serverUrl = app.config.serverUrl;
			const data = ctx.request.body;
			let form = new FormData()
			let url = '';
			if (data.t == "1") {
				url = `${serverUrl}/ModeLaserTrigger`
			} else if (data.t == "2") {
				url = `${serverUrl}/ModeRandomTrigger`
			} else if (data.t == "3") {
				url = `${serverUrl}/ModeManualTrigger`
			}
			form.append("data", 0)
			let resp = await new Promise((resolve, reject) => {
				form.submit(url, function (err, res) {
					resolve(res)
				});
			})
			ctx.body = resp
		}

		async tonce(ctx) {
			const serverUrl = app.config.serverUrl;
			let form = new FormData()
			form.append("data", 0)
			let resp = await new Promise((resolve, reject) => {
				form.submit(`${serverUrl}/LaserTriggerTriggerOnce`, function (err, res) {
					resolve(res)
				});
			})
			ctx.body = resp
		}
	};
}