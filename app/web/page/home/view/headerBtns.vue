<template>
    <div class="header-btns">
        <el-menu class="el-menu-vertical-demo" @select='handleCommand1'>
            <el-submenu index="1">
                <template slot="title">
                    硬件
                </template>
                <el-menu-item index="main">主摄像机</el-menu-item>
                <el-menu-item index="assist">辅助摄像机</el-menu-item>
                <el-menu-item index="light">光源</el-menu-item>
                <el-menu-item index="laser">激光触发</el-menu-item>
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

        <el-dialog title="主摄像机" :visible.sync="mainDialog" append-to-body width='400px'>
            <el-form :model="main">
                <el-form-item label="曝光">
                    <el-input type="number" v-model.trim.number="main.b" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="增益">
                    <el-input step="0.1" type="number" v-model.trim.number="main.z" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="伽马">
                    <el-input step="0.1" type="number" v-model.trim.number="main.g" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="mainDialog = false">取 消</el-button>
                <el-button type="primary" @click="mainClick">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="辅助摄像机" :visible.sync="assistDialog" append-to-body width='400px'>
            <el-form :model="assist">
                <el-form-item label="曝光">
                    <el-input step="0.1" type="number" v-model.trim.number="assist.b" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="assistDialog = false">取 消</el-button>
                <el-button type="primary" @click="assistClick">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="光源" :visible.sync="lightDialog" append-to-body width='400px'>
            <el-form :model="light">
                <el-radio v-model="light.on" label="1">开灯</el-radio>
                <el-radio v-model="light.on" label="2">关灯</el-radio>
                <el-form-item label="亮度">
                    <el-input type="number" v-model.trim.number="light.l" auto-complete="off" min="50" max="255"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="lightDialog = false">取 消</el-button>
                <el-button type="primary" @click="lightClick">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="激光触发" :visible.sync="laserDialog" append-to-body width='400px'>
            <el-form :model="laser">
                <el-radio v-model="laser.t" label="1">硬件触发</el-radio>
                <el-radio v-model="laser.t" label="2">随机触发</el-radio>
                <el-radio v-model="laser.t" label="3">手动触发</el-radio>
                <el-button @click="tOnceClick">触发一次</el-button>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="laserDialog = false">取 消</el-button>
                <el-button type="primary" @click="laserClick">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/babel">
    export default {
      components: {},
      data() {
        return {
          mainDialog: false,
          assistDialog: false,
          lightDialog: false,
          laserDialog: false,
          radio: 1,
          light: {
            l: 250,
            on: "1"
          },
          laser: {
            t: "1"
          },
          assist: {
            b: 1.0
          },
          main: {
            b: 80000,
            z: 1.0,
            g: 1.0
          }
        }
      },
      mounted() {},
      methods: {
        handleCommand1(command) {
          console.log(command)
          this[`${command}Dialog`] = true
        },
        async assistClick() {
          let resp = await this.$request.post(`/api/assist`, this.assist)
          this.assistDialog = false
        },
        async mainClick() {
          let resp = await this.$request.post(`/api/main`, this.main)
          this.mainDialog = false
        },
        async lightClick() {
          let resp = await this.$request.post(`/api/light`, this.light)
          this.lightDialog = false
        },
        async laserClick() {
          let resp = await this.$request.post(`/api/laser`, this.laser)
          this.laserDialog = false
        },
        async tOnceClick() {
          let resp = await this.$request.post(`/api/tonce`)
        }
      }
    }
</script>
<style lang="scss">
    .header-btns {
      background: rgba(255, 255, 255, 0.06);
      border-radius: 8px;
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

