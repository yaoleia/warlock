import Vue from 'vue'
import 'asset/css/transition.scss'
import ElementUI from 'element-ui'
import 'asset/css/element-variables.scss'
Vue.use(ElementUI);

import VueIconfont from 'vue-iconfont'
// 引入iconfont
import 'asset/iconfont/iconfont.css'
// import 'asset/iconfont/iconfont.js'
Vue.use(VueIconfont, [
  // 定义 v-icon 组件以使用 font-class 图标
  {
    tag: 'v-icon',
    prefix: 'v-icon',
    type: 'font'
  },
  // 定义 v-svg-icon 组件以使用 SVG 图标
  {
    tag: 'v-svg-icon',
    prefix: 'v-icon',
    type: 'svg'
  }
])

Vue.config.devtools = true;