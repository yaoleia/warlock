'use strict';
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
module.exports = {
  egg: true,
  framework: 'vue',
  entry: {
    include: ['app/web/page'],
    exclude: [/app\/web\/page\/admin\/home\/index\/(component|view|router|store)/],
    loader: {
      client: 'app/web/framework/vue/entry/client-loader.js',
      server: 'app/web/framework/vue/entry/server-loader.js',
    }
  },
  alias: {
    clientApi: 'app/web/clientApi/index.js',
    server: 'app/web/framework/vue/entry/server.js',
    client: 'app/web/framework/vue/entry/client.js',
    asset: 'app/web/asset',
    component: 'app/web/component',
    framework: 'app/web/framework',
    vue: 'vue/dist/vue.esm.js',
    '@': 'app/web'
  },
  dll: ['vue', 'axios', 'vue-router', 'vuex', 'vuex-router-sync'],
  loaders: {
    scss: true
  },
  node: {
    console: true,
    fs: 'empty'
  },
  plugins: [
    {
      analyzer: false
    },
    {
      provide: {
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
      }
    },
    new LodashModuleReplacementPlugin({
      shorthands: true,
      path: true,
      flattening: true
    })
  ],
  done() {
    console.log('如果启动成功后, Chrome控制台浏览器脚本报错, 可以尝试执行 npm run clean 清除缓存解决');
  }
};