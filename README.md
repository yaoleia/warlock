# egg-vue-webpack-boilerplate

基于 Egg + Vue + Webpack4 多页面服务端渲染项目开发项目


## 版本

- Egg 版本： ^2.x.x
- Node 版本: Node ^8.9.0+
(https://github.com/hubcarl/egg-vue-webpack-boilerplate/tree/node6)
- Webpack 版本: ^4.x.x, 对应 `easywebpack-vue` 版本为 ^4.x.x
- Vue 版本: ^2.5.0

## 说明 

![hubcarl](https://avatars3.githubusercontent.com/u/4983042?v=4&u=0befb64a57a7911c630b7f97df5632385b08da2a&s=250)

## 文档

- http://hubcarl.github.io/easywebpack/vue/rule
- https://zhuanlan.zhihu.com/easywebpack


## 项目结构和基本规范

    ├── app
    │   ├── controller
    │   │   ├── test
    │   │   │   └── test.js
    │   ├── extend
    │   ├── lib
    │   ├── middleware
    │   ├── mocks
    │   ├── proxy
    │   ├── router.js
    │   ├── view
    │   │   ├── about                         // 服务器编译的jsbundle文件
    │   │   │   └── about.js
    │   │   ├── home
    │   │   │     └── home.js                 // 服务器编译的jsbundle文件
    │   │   └── layout                        // 用于根据指定的layout生成对应的html页面, 用于服务器渲染失败时,采用客户端渲染
    │   │       └── layout.html
    │   └── web                               // 前端工程目录
    │       ├── asset                         // 存放公共js,css资源
    │       ├── framework                     // 前端公共库和第三方库
    │       │   ├── fastclick
    │       │   │   └── fastclick.js
    │       │   ├── sdk
    │       │   │   ├── sdk.js
    │       │   ├── storage
    │       │   │   └── storage.js
    │       │   └── vue                           // 与vue相关的公开代码
    │       │       ├── app.js                    // 前后端调用入口, 默认引入componet/directive/filter
    │       │       ├── component.js              // 组件入口, 可以增加component目录,类似下面的directive
    │       │       ├── directive                 // directive 目录,存放各种directive组件
    │       │       ├── directive.js              // directive引用入口
    │       │       └── filter.js                 // filter引用入口
    │       ├── page                              // 前端页面和webpack构建目录, 也就是webpack打包配置entryDir
    │       │   ├── home                          // 每个页面遵循目录名, js文件名, scss文件名, vue文件名相同
    │       │   │   ├── home.scss
    │       │   │   ├── home.vue
    │       │   │   ├── images                    // 页面自有图片,公共图片和css放到asset下面
    │       │   │   │   └── icon_more.png
    │       │   │   └── w-week                    // 页面自有组件,公共组件放到widget下面
    │       │   │       ├── w-week.scss
    │       │   │       └── w-week.vue
    │       │   └── test                          // 每个页面遵循目录名, js文件名, scss文件名, vue文件名相同
    │       │       └── test.vue
    │       ├── store                             // 引入vuex 的基本规范, 可以分模块
    │       │   ├── app
    │       │   │   ├── actions.js
    │       │   │   ├── getters.js
    │       │   │   ├── index.js
    │       │   │   ├── mutation-type.js
    │       │   │   └── mutations.js
    │       │   └── store.js
    │       └── component                         // 公共业务组件, 比如loading, toast等, 遵循目录名, js文件名, scss文件名, vue文件名相同
    │           ├── loading
    │           │   ├── loading.scss
    │           │   └── loading.vue
    │           ├── test
    │           │   ├── test.vue
    │           │   └── test.scss
    │           └── toast
    │               ├── toast.scss
    │               └── toast.vue
    ├── build                                   //  webpack 自定义配置入口, 会与默认配置进行合并(看似这么多,其实这里只是占个位说明一下)
    │   ├── base
    │   │   └── index.js                        // 公共配置        
    │   ├──  client                             // 客户端webpack编译配置
    │   │   ├── dev.js
    │   │   ├── prod.js
    │   │   └── index.js
    │   ├──  server                             // 服务端webpack编译配置
    │   │    ├── dev.js
    │   │    ├── prod.js
    │   │    └── index.js
    │   └── index.js
    ├── config
    │   ├── config.default.js
    │   ├── config.local.js
    │   ├── config.prod.js
    │   ├── config.test.js
    │   └── plugin.js
    ├── doc
    ├── index.js
    ├── public                                 // webpack编译目录结构, render文件查找目录
    │   ├── manifest.json                      // 资源依赖表
    │   ├── static
    │   │   ├── css
    │   │   │   ├── home
    │   │   │   │   ├── home.07012d33.css
    │   │   │   └── test
    │   │   │       ├── test.4bbb32ce.css
    │   │   ├── img
    │   │   │   ├── change_top.4735c57.png
    │   │   │   └── intro.0e66266.png
    │   ├── test
    │   │   └── test.js
    │   └── vendor.js                         // 生成的公共打包库
