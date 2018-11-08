'use strict';
const webpack = require('webpack');
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
		server: 'app/web/framework/vue/entry/server.js',
		client: 'app/web/framework/vue/entry/client.js',
		asset: 'app/web/asset',
		component: 'app/web/component',
		framework: 'app/web/framework',
		vue: 'vue/dist/vue.esm.js'
	},
	module: {
		rules: [{
			test: require.resolve('jquery'),
			use: [{
				loader: 'expose-loader',
				options: 'jQuery'
			}, {
				loader: 'expose-loader',
				options: '$'
			}]
		}]
	},
	dll: ['vue', 'axios', 'vue-router', 'vuex', 'vuex-router-sync'],
	loaders: {
		scss: true
	},
	node: {
		console: true
	},
	plugins: [
		/* Use the ProvidePlugin constructor to inject jquery implicit globals */
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
			"window.$": "jquery",
			_: 'lodash'
		})
	],
	done() {
		console.log('如果启动成功后, Chrome控制台浏览器脚本报错, 可以尝试执行 npm run clean 清除缓存解决');
	}
};