'use strict';
const path = require('path');
const fs = require('fs');
const env = process.env;
module.exports = app => {
  const exports = {};

  // exports.serverUrl = env.SERVER_URL || 'http://0.0.0.0:5000';
  exports.serverUrl = env.SERVER_URL || 'https://easy-mock.com/mock/5c25a7aac2518a5416c67ccd/designer';

  exports.cluster = {
    listen: {
      port: 7501
    }
  };

  exports.session = {
    renew: true,
  }

  exports.io = {
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: ['filter']
      }
    }
  };

  exports.siteFile = {
    '/favicon.ico': fs.readFileSync(
      path.join(app.baseDir, 'app/web/asset/images/favicon.ico')
    )
  };

  exports.http = {
    headers: {
      common: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    },
    timeout: 5000
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
    dir: [path.join(app.baseDir, 'images'), path.join(app.baseDir, 'public')]
  };

  exports.keys = '123456';

  exports.middleware = ['locals', 'access', 'gzip', 'proxy'];

  exports.proxy = {
    match: '/api/proxyurl'
  };

  exports.gzip = {
    threshold: 1024 // 小于 1k 的响应体不压缩
  };

  exports.security = {
    csrf: {
      // enable: false,
      ignoreJSON: false,
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
      headerName: 'x-csrf-token'
    },
    xframe: {
      enable: false
    }
  };

  return exports;
};
