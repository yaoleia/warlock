'use strict';
module.exports = {
	egg: true,
	framework: 'vue',
	entry: {
		include: ['app/web/page'],
		exclude: ['app/web/page/[a-z]+/component', 'app/web/page/test'],
		loader: {
			client: 'app/web/framework/vue/entry/client-loader.js',
			server: 'app/web/framework/vue/entry/server-loader.js',
		}
	},
	compile: {
		thread: true, // 多进程编译
		cache: true // 启动编译缓存
	},
	alias: {
		server: 'app/web/framework/vue/entry/server.js',
		client: 'app/web/framework/vue/entry/client.js',
		asset: 'app/web/asset',
		component: 'app/web/component',
		framework: 'app/web/framework',
		vue: 'vue/dist/vue.esm.js'
	},
	dll: ['vue', 'axios'],
	loaders: {},
	plugins: {},
	done() {

	}
};