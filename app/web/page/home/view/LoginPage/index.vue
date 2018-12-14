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
    .login {
        .login-info input {
            width: 100%;
        }
        .login-form {
            width: 375px;
            height: 400px;
            padding: 30px;
            background-color: white;
            text-align: left;
            border-radius: 4px;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            .login-header {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .el-checkbox__label {
                font-size: 14px;
                font-weight: normal;
                padding-left: 4px;
            }
        }
    }
</style>

<script type="text/babel">
    export default {
        data() {
            return {
                userName: '',
                password: ''
            }
        },
        methods: {
            passwordFocus() {
                this.$refs.password.focus();
            },
            async login() {
                const resp = await this.$request.post('/api/login', {
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