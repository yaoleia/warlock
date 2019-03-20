<template>
    <div class="param-nav">
        <el-menu class="el-menu-vertical-demo" @select='handleCommand1'>
            <el-submenu index="1">
                <template slot="title">
                    硬件
                </template>
                <el-menu-item index="main">主摄像机</el-menu-item>
                <el-menu-item index="usb">辅助摄像机</el-menu-item>
                <el-menu-item index="light">光源</el-menu-item>
                <el-menu-item index="trigger">激光触发</el-menu-item>
            </el-submenu>
        </el-menu>

        <el-menu class="el-menu-vertical-demo">
            <el-submenu index="2">
                <template slot="title">
                    算法
                </template>
                <el-menu-item index="differ">差分</el-menu-item>
                <el-menu-item index="test">检测</el-menu-item>
            </el-submenu>
        </el-menu>

        <el-dialog title="主摄像机" :visible.sync="mainDialog" :modal="false">
            <span class="demonstration">h_preview</span>
            <el-slider v-model="main.h_preview" show-input @keyup.enter.native="submitClick('main')" :max="2000" @change="changeSlider('main','h_preview','w_preview',3/2)"></el-slider>
            <span class="demonstration">w_preview</span>
            <el-slider v-model="main.w_preview" show-input @keyup.enter.native="submitClick('main')" :max="3000" @change="changeSlider('main','w_preview','h_preview',2/3)"></el-slider>
            <span class="demonstration">帧率</span>
            <el-slider v-model="main.frameRate" show-input @keyup.enter.native="submitClick('main')" :max="100"></el-slider>
            <span class="demonstration">曝光</span>
            <el-slider v-model="main.exposure_time" show-input @keyup.enter.native="submitClick('main')" :max="2000"></el-slider>
            <span class="demonstration">增益</span>
            <el-slider v-model="main.gain" show-input :max="100" @keyup.enter.native="submitClick('main')"></el-slider>
            <span class="demonstration">伽马</span>
            <el-slider v-model="main.gamma" show-input :max="10" @keyup.enter.native="submitClick('main')"></el-slider>
            <span class="demonstration">饱和</span>
            <el-slider v-model="main.saturation" show-input :max="1000" @keyup.enter.native="submitClick('main')"></el-slider>
            <span class="demonstration">锐度</span>
            <el-slider v-model="main.sharpness" show-input :max="100" @keyup.enter.native="submitClick('main')"></el-slider>
            <span class="demonstration">色度</span>
            <el-slider v-model="main.hue" show-input :max="1000" @keyup.enter.native="submitClick('main')"></el-slider>
            <span class="demonstration">红平衡比</span>
            <el-slider v-model="main.balance_ratio_red" show-input :max="3000" @keyup.enter.native="submitClick('main')"></el-slider>
            <span class="demonstration">绿平衡比</span>
            <el-slider v-model="main.balance_ratio_green" show-input :max="3000" @keyup.enter.native="submitClick('main')"></el-slider>
            <span class="demonstration">蓝平衡比</span>
            <el-slider v-model="main.balance_ratio_blue" show-input :max="3000" @keyup.enter.native="submitClick('main')"></el-slider>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('main')">关 闭</el-button>
                <el-button type="primary" @click="submitClick('main')" :loading="mainLoading">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="辅助摄像机" :visible.sync="usbDialog" :modal="false">
            <span class="demonstration">cam_num</span>
            <el-input-number @keyup.enter.native="submitClick('usb')" v-model="usb.cam_num" :min="0" :max="10" label="描述文字"></el-input-number><br /><br />
            <span class="demonstration">曝光</span>
            <el-slider v-model="usb.exposure_time" show-input :max="2000" @keyup.enter.native="submitClick('usb')"></el-slider>
            <span class="demonstration">h_preview</span>
            <el-slider v-model="usb.h_preview" show-input :max="2000" @keyup.enter.native="submitClick('usb')" @change="changeSlider('usb','h_preview','w_preview',3/2)"></el-slider>
            <span class="demonstration">w_preview</span>
            <el-slider v-model="usb.w_preview" show-input :max="3000" @keyup.enter.native="submitClick('usb')" @change="changeSlider('usb','w_preview','h_preview',2/3)"></el-slider>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('usb')">关 闭</el-button>
                <el-button type="primary" @click="submitClick('usb')" :loading="usbLoading">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="光源" :visible.sync="lightDialog" :modal="false">
            <el-form :model="light">
                <el-radio-group v-model="light.init_status" @change="submitClick('light')">
                    <el-radio :label="true">开灯</el-radio>
                    <el-radio :label="false">关灯</el-radio>
                </el-radio-group><br /><br />
                <span class="demonstration">亮度</span>
                <el-slider v-model="light.light_bright" show-input :min="50" :max="255" @keyup.enter.native="submitClick('light')"></el-slider>
                <el-form-item label="port">
                    <el-input v-model.trim="light.port" auto-complete="off" @keyup.enter.native="submitClick('light')"></el-input>
                </el-form-item>
                <el-form-item label="baudrate">
                    <el-input v-model.trim="light.baudrate" auto-complete="off" @keyup.enter.native="submitClick('light')"></el-input>
                </el-form-item>
                <el-form-item label="stopbits">
                    <el-input v-model.trim="light.stopbits" auto-complete="off" @keyup.enter.native="submitClick('light')"></el-input>
                </el-form-item>
                <el-form-item label="timeout">
                    <el-input v-model.trim="light.timeout" auto-complete="off" @keyup.enter.native="submitClick('light')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('light')">关 闭</el-button>
                <el-button type="primary" @click="submitClick('light')" :loading="lightLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="激光触发" :visible.sync="triggerDialog" :modal="false">
            <el-form :model="trigger">
                <el-radio-group v-model="trigger.model" @change="submitClick('trigger')">
                    <el-radio :label="1">硬件触发</el-radio>
                    <el-radio :label="2">随机触发</el-radio>
                    <el-radio :label="3">手动触发</el-radio>
                </el-radio-group><br /><br />
                <el-form-item label="port">
                    <el-input v-model.trim="trigger.port" auto-complete="off" @keyup.enter.native="submitClick('trigger')"></el-input>
                </el-form-item>
                <el-form-item label="baudrate">
                    <el-input v-model.trim="trigger.baudrate" auto-complete="off" @keyup.enter.native="submitClick('trigger')"></el-input>
                </el-form-item>
                <el-form-item label="stopbits">
                    <el-input v-model.trim="trigger.stopbits" auto-complete="off" @keyup.enter.native="submitClick('trigger')"></el-input>
                </el-form-item>
                <el-form-item label="timeout">
                    <el-input v-model.trim="trigger.timeout" auto-complete="off" @keyup.enter.native="submitClick('trigger')"></el-input>
                </el-form-item>
                <el-button @click="tOnceClick">触发一次</el-button>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('trigger')">关 闭</el-button>
                <el-button type="primary" @click="submitClick('trigger')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/babel">
    import utils from 'framework/utils'
    export default {
        components: {},
        data() {
            return {
                mainDialog: false,
                usbDialog: false,
                lightDialog: false,
                triggerDialog: false,
                mainLoading: false,
                usbLoading: false,
                lightLoading: false,
                triggerLoading: false,
                light: {
                    light_bright: 255,
                    init_status: false,
                    port: '/dev/ttyUSB1',
                    baudrate: 9600,
                    stopbits: 1,
                    timeout: 0.5
                },
                trigger: {
                    model: 1,
                    port: '/dev/ttyUSB0',
                    baudrate: 9600,
                    stopbits: 1,
                    timeout: 0.5
                },
                usb: {
                    cam_num: 0,
                    exposure_time: 500,
                    w_preview: 609,
                    h_preview: 406
                },
                main: {
                    w_preview: 609,
                    h_preview: 406,
                    frameRate: 2,
                    exposure_time: 400,
                    gain: 0,
                    gamma: 0.45,
                    saturation: 128,
                    sharpness: 0,
                    hue: 128,
                    balance_ratio_red: 2016,
                    balance_ratio_green: 1024,
                    balance_ratio_blue: 1919
                }
            }
        },
        mounted() {
            this.getCache();
        },
        methods: {
            getCache() {
                if (window.localStorage.usb) {
                    this.usb = JSON.parse(window.localStorage.usb)
                }
                if (window.localStorage.main) {
                    this.main = JSON.parse(window.localStorage.main)
                }
                if (window.localStorage.light) {
                    this.light = JSON.parse(window.localStorage.light)
                }
                if (window.localStorage.trigger) {
                    this.trigger = JSON.parse(window.localStorage.trigger)
                }
            },
            changeSlider(obj, attr1, attr2, rate) {
                this[obj][attr2] = this[obj][attr1] * rate;
            },
            handleCommand1(command) {
                // console.log(command)
                this[`${command}Dialog`] = true;
            },
            cancel(name) {
                this.getCache();
                this[`${name}Dialog`] = false;
            },
            async submitClick(name) {
                try {
                    this[`${name}Loading`] = true;
                    let obj = null;
                    if (window.localStorage[name]) {
                        obj = utils.difference(this[name], JSON.parse(window.localStorage[name]))
                        if (JSON.stringify(obj) === '{}') {
                            this.$message.info('没有更改配置');
                            return;
                        }
                    }
                    const resp = await this.$request.test.postParam(name, obj || this[name])
                    if (resp.data && resp.data.code === 1) {
                        window.localStorage[name] = JSON.stringify(this[name])
                        this.$message.success(`提交${name}配置成功`);
                    }
                } catch (error) {
                    console.error(error)
                } finally {
                    this[`${name}Loading`] = false;
                }
            },
            async lightClick() {
                const resp = await this.$request.test.postLight(this.light)
                this.lightDialog = false
            },
            async tOnceClick() {
                const resp = await this.$request.test.postTonce();
            }
        }
    }
</script>
<style lang="scss">
    .param-nav {
        background: rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        position: relative;
        .el-dialog__wrapper {
            position: absolute;
            right: auto;
            bottom: auto;
            height: 100%;
            width: 130%;
        }
        .el-dialog {
            margin: 0 !important;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            .el-dialog__body {
                flex-grow: 1;
                overflow-y: auto;
            }
        }
        .el-submenu__title {
            color: #fff;
        }
        .el-menu-item {
            color: #fff;
        }
        .el-menu-item:focus,
        .el-menu-item:hover {
            background: #222;
        }
        .el-submenu__title:hover {
            background: rgba(255, 255, 255, 0.06);
        }
        .el-submenu__title i {
            color: #fff;
            font-weight: bold;
        }
    }
</style>

