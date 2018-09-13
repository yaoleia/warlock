'use strict';
module.exports = {
	egg: true,
	framework: 'vue',
	entry: {
		include: ['app/web/page'],
		exclude: [/app\/web\/page\/admin\/home\/(component|view|router|store)/],
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
	compile: {
		thread: true, // 多进程编译
		cache: true // 启动编译缓存
	},
	dll: ['vue', 'axios', 'vue-router', 'vuex', 'vuex-router-sync'],
	loaders: {
		scss: true
	},
	node: {
		console: true
	},
	plugins: {},
	done() {

	}
};