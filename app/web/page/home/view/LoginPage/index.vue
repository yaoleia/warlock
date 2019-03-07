<template>
    <div class="login">
        <div class="login-form">
            <div class="login-header">
                <div class="logo">
                    <img src="~asset/images/logo_nav.png" height="60" alt="">
                </div>

                <svg id="demo" xmlns="http://www.w3.org/2000/svg" width="500" height="200" viewBox="0 0 500 200">
                    <defs>
                        <pattern id="cutPattern" patternUnits="userSpaceOnUse" width="500" height="400" x="0" y="0">
                            <text transform="translate(250 130)" text-anchor="middle" font-size="90" fill="#efefef">创新奇智</text>
                        </pattern>
                    </defs>
                    <g id="strips" fill="url(#cutPattern)">
                        <rect x="0" y="50" width="500" height="31" />
                        <rect x="0" y="70" width="500" height="21" />
                        <rect x="0" y="90" width="500" height="21" />
                        <rect x="0" y="110" width="500" height="51" />
                    </g>
                </svg>

            </div>
            <div class="login-info">
                <el-input placeholder="请输入用户名" @keyup.enter.native="passwordFocus" suffix-icon="fa fa-user" v-model="userName" style="margin-bottom: 18px">
                    <template slot="prepend">
                        <v-icon name='user'></v-icon>
                    </template>
                </el-input>

                <el-input placeholder="请输入密码" ref='password' suffix-icon="fa fa-keyboard-o" @keyup.enter.native="login" v-model="password" type="password" style="margin-bottom: 18px">
                    <template slot="prepend">
                        <v-icon name='mm'></v-icon>
                    </template>
                </el-input>
            </div>
            <el-button type="primary" style="width: 100%;margin: 18px 0" @click.native="login" size="medium">登录</el-button>
        </div>
    </div>
</template>

<style lang="scss">
    .login {
        .login-info {
            padding-top: 20px;
            input {
                width: 100%;
            }
            .el-input-group__prepend {
                padding: 0 12px;
            }
        }
        .login-form {
            width: 320px;
            height: 470px;
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
                display: flex;
                align-items: center;
                h3 {
                    font-size: 40px;
                    flex-grow: 1;
                    text-align: center;
                    color: #fff;
                    line-height: 70px;
                    padding-right: 30px;
                    position: relative;
                }
                .logo {
                    width: 52px;
                    overflow: hidden;
                }
            }
            .el-checkbox__label {
                font-size: 14px;
                font-weight: normal;
                padding-left: 4px;
            }
        }
        .superShadow {
            text-shadow: 0 1px 0 hsl(174, 5%, 80%), 0 2px 0 hsl(174, 5%, 75%),
                0 3px 0 hsl(174, 5%, 70%), 0 4px 0 hsl(174, 5%, 66%),
                0 0 5px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        #demo {
            width: 400px;
            height: 100px;
            margin-left: -38px;
        }
    }
</style>

<script type="text/babel">
    import { TimelineMax, Back, Elastic } from 'gsap/TweenMax';

    export default {
        data() {
            return {
                userName: '',
                password: ''
            }
        },
        mounted() {
            this.init();
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
            },
            init() {
                const strips = document.querySelectorAll('#strips rect');
                const tl = new TimelineMax({ delay: 0.75 });
                tl.staggerFrom(strips, 1, { cycle: { x: [-1000, 1000] }, ease: Back.easeOut }, 0.15);
                tl.staggerTo(strips, 0.4, { cycle: { x: [-50, 70, -70, 120], opacity: [0.5, 0.8] }, repeat: 1, repeatDelay: 0.2, yoyoEase: Elastic.easeOut.config(2, 0.2), ease: Back.easeInOut }, -0.05, '+=1');
                tl.staggerTo(strips, 0.5, { cycle: { x: [-30, -160, 120, -50], y: [-30, -10, 10, 30], rotation: [-2, 2, -4, 4] }, transformOrigin: 'center center', repeat: 1, repeatDelay: 0.2, yoyo: true, ease: Back.easeInOut }, 0.07, '+=1');
            }
        }
    };
</script>