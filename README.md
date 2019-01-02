# egg-vue-webpack-boilerplate

基于 Egg + Vue + Webpack4 Server Side Render 工程项目，包括前台系统和后台管理系统

## 1. 版本

-   Egg 版本： ^2.x.x
-   Node 版本: Node ^8.x.x+, Node 6.x.x 版本请见 [Egg 1.0 + Node6 分支](https://github.com/hubcarl/egg-vue-webpack-boilerplate/tree/node6)
-   Webpack 版本: ^4.x.x, 对应 `easywebpack-vue` 版本为 ^4.x.x; Webpack3 版本项目骨架请见 `webpack3` 分支, 对应 `easywebpack-react` 版本为 3.x.x
-   Vue 版本: ^2.5.0

## 2. 文档

-   http://hubcarl.github.io/easywebpack/vue/rule
-   https://zhuanlan.zhihu.com/easywebpack

## 3. 使用

#### 3.1 安装 cli(非必需)

```bash
npm install easywebpack-cli -g
```

^3.5.0 开始， `easywebpack-cli` 已内置 `devDependencies` 中, 无需安装。如果你需要在命令行使用 `easy` 命令, 可以单独全局安装。

#### 3.2 安装依赖

```bash
npm install
```

#### 3.3 本地开发启动应用

```bash
npm run dev
```

应用访问: http://127.0.0.1:7501

#### 3.4 发布模式启动应用

-   首先在本地或者 ci 构建好 jsbundle 文件

```bash
npm run build
```

-   然后,启动应用

```bash
npm start
```

详细打包部署请见： http://hubcarl.github.io/easywebpack/vue/dev/

## 4. 配置说明(支持三种方式)

#### 4.1 方式一: `easywebpack-cli` 根据 `webpack.config.js` 自动创建 Webpack Config

```js
;`config/config.local.js`
const EasyWebpack = require("easywebpack-vue")
exports.webpack = {
    webpackConfigList: EasyWebpack.getWebpackConfig()
}
```

#### 4.2 方式二: 自己编写 Webpack 配置

编写配置请见 tag `1.0.0` build 目录代码实现

```js
;`config/config.local.js`
exports.webpack = {
    webpackConfigList: [
        require(path.join(app.baseDir, "build/client")), // http://127.0.0.1:9000
        require(path.join(app.baseDir, "build/server")) // http://127.0.0.1:9001
    ]
}
```

#### 4.3 方式三: 开启多进程编译

[egg npm start 启动开启多进程编译](http://hubcarl.github.io/easywebpack/vue/version/)

构建会同时启动两个 webpack 构建服务, 客户端 js 构建(build/client), 服务端构建(build/server), 默认端口 9000, webpackConfigList 端口依次递增.

## 5. 项目结构和基本规范

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

```bash
$ cd baseDir
$ npm install --production
$ tar -zcvf ../release.tar.gz .
```

主题生成工具安装成功后，如果全局安装可以在命令行里通过 et 调用工具，如果安装在当前目录下，需要通过 node_modules/.bin/et 访问到命令。执行 -i 初始化变量文件。默认输出到 element-variables.scss，当然你可以传参数指定文件输出目录。
保存文件后，到命令行里执行 et 编译主题，如果你想启用 watch 模式，实时编译主题，增加 -w 参数；如果你在初始化时指定了自定义变量文件，则需要增加 -c 参数，并带上你的变量文件名

```bash
// import "../../asset/theme/index.css"
sudo node_modules/.bin/et -c ./app/web/asset/theme/theme.scss -w -o ./app/web/asset/theme/
```
yarn upgrade --latest

sudo chown -R $USER /usr/local

sudo chmod -R 777 ./