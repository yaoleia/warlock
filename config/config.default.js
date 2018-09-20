'use strict';
const path = require('path');
const fs = require('fs');
const env = process.env;
module.exports = app => {
	const exports = {};

	exports.serverUrl = env.SERVER_URL || "http://127.0.0.1:5000";

	exports.io = {
		namespace: {
			'/': {
				connectionMiddleware: ['auth'],
				packetMiddleware: ['filter'],
			},
		}
	};


	exports.siteFile = {
		'/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/favicon.ico'))
	};

	exports.http = {
		headers: {
			common: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		},
		timeout: 10000
	};

	exports.vuessr = {
		layout: path.join(app.baseDir, 'app/web/view/layout.html'),
		renderOptions: {
			// 告诉 vue-server-renderer 去 app/view 查找异步 chunk 文件
			basedir: path.join(app.baseDir, 'app/view')
		}
	};

	exports.logger = {
		consoleLevel: 'DEBUG',
		dir: path.join(app.baseDir, 'logs')
	};

	exports.static = {
		prefix: '/public/',
		dir: path.join(app.baseDir, 'public')
	};

	exports.keys = '123456';

	exports.middleware = [
		'locals',
		'access'
	];

	exports.security = {
		csrf: {
			ignoreJSON: false,
			cookieName: 'csrfToken',
			sessionName: 'csrfToken',
			headerName: 'x-csrf-token'
		},
		xframe: {
			enable: false,
		}
	};

	return exports;
};