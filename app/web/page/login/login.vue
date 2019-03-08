<template>
    <div class="login">
        <div class="login-form">
            <div class="login-header">
                <img src="~asset/images/logo_nav.png" height="100" alt="">
            </div>
            <div class="login-info">
                <el-input placeholder="请输入用户名" @keyup.enter.native="passwordFocus" suffix-icon="fa fa-user" v-model="userName" style="margin-bottom: 18px">
                </el-input>

                <el-input placeholder="请输入密码" ref='password' suffix-icon="fa fa-keyboard-o" @keyup.enter.native="login" v-model="password" type="password" style="margin-bottom: 18px">
                </el-input>
            </div>
            <el-button type="primary" style="width: 100%;margin-bottom: 18px" @click.native="login">登录</el-button>
        </div>
    </div>
</template>

<style lang="scss">
    @import "login.scss";
</style>

<script type="text/babel">
    import Vue from 'vue';
    import 'asset/css/element-variables.scss'
    import {
        Input,
        Button,
        Checkbox,
        Message
    } from 'element-ui';
    Vue.component(Input.name, Input);
    Vue.component(Button.name, Button);
    Vue.component(Checkbox.name, Checkbox);
    Vue.prototype.$message = Message;
    export default {
        data: {
            userName: '',
            password: ''
        },
        methods: {
            passwordFocus() {
                this.$refs.password.focus();
            },
            async login() {
                const resp = await this.$request.account.login({
                    username: this.userName,
                    password: this.password
                })
                if (resp.data === 'success') {
                    location.href = '/'
                    return;
                }
                this.$message({
                    message: '用户名或密码错误',
                    type: 'error'
                })
            }
        }
    };
</script>