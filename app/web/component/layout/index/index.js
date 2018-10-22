import Vue from 'vue';
import ElementUI from 'element-ui';
import './element-variables.scss'
import MainLayout from './main.vue';
import '../../../asset/css/global.css';
import './index.scss';
import createLayout from '../layout';
const tpl = '<div class="index" id="app"><MainLayout><div slot="header"><slot></slot></div></MainLayout></div>';
Vue.use(ElementUI);
export default createLayout('Layout', { MainLayout }, tpl);
