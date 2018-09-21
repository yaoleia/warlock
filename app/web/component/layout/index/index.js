import Vue from 'vue';
import MainLayout from './main.vue';
import '../../../asset/css/global.css';
import './index.scss';
import createLayout from '../layout';
const tpl = '<div class="index" id="app"><MainLayout><div slot="header"><slot></slot></div></MainLayout></div>';
export default createLayout('Layout', { MainLayout }, tpl);
