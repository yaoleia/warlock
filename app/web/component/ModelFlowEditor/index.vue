<template>
    <div class="editor">
        <toolbar ref='toolbar' @read='readData' @change-eage="changeEage" :style="{visibility: readMode?'hidden':''}" />
        <div class='go-back'>
            <div class="design-name">流程名称：</div>
            <el-input class='name-input' v-model="name" placeholder="未命名" :disabled="readMode"></el-input>
            <el-button v-if="readMode" type="text" icon="el-icon-back" @click="goBack(true)">返回</el-button>
            <div v-else class="btns">
                <el-button type="success" size="mini" @click="showLayout=true" v-if='output.length'>layout</el-button>
                <el-button type="primary" size="mini" @click="saveData">保存</el-button>
                <el-button type="text" icon="el-icon-back" @click="goBack(false)">返回</el-button>
            </div>
        </div>
        <div class="bottom-container">
            <item-pannel ref="itempannel" v-show="!readMode" />
            <detail-pannel ref='detailpannel' :output='output' :readMode='readMode' :selectedModel='selectedModel' @changeOutput='fixEvPramas' @updateGraph='updateGraph' @toggleGrid='toggleGrid' />
            <navigator :cur-zoom="curZoom" :min-zoom="minZoom" :max-zoom="maxZoom" @change-zoom="changeZoom">
                <div ref="minimap" slot="minimap" class="minimap"></div>
            </navigator>
            <page ref="page" @keydown.native.ctrl.192='ctrl192' />
            <terminal-box :runDesign.sync='runDesign' @stop='deleteTestTask' @start='creatTestTask' :taskId='taskId' :msgList.sync='msgList' :showTerminal.sync='showTerminal' :terminalIs='terminalIs' :runMsgList='runMsgList'></terminal-box>
            <context-menu ref="contextmenu" v-show="!readMode" @terminalFor='terminalFor' />
        </div>
        <el-dialog title="页面布局" :visible.sync="showLayout" @opened='dialogOpened = true' @closed='dialogOpened = false' custom-class="layout-pop-dialog" :fullscreen='true' :close-on-press-escape='false'>
            <layout-design :runMsgList='runMsgList' :dialogOpened='dialogOpened' :layout='layout' :output='output' />
        </el-dialog>
    </div>
</template>

<script>
    import layoutDesign from 'component/LayoutDesign'
    import TerminalBox from '../TerminalBox'
    import DetailPannel from './detailpannel'
    import Navigator from './navigator';
    import ItemPannel from './itempannel'
    import Toolbar from './toolbar';
    import ContextMenu from './context-menu';
    import Page from './page';
    import Editor from './editor.js';

    export default {
        components: {
            Navigator,
            Toolbar,
            ContextMenu,
            Page,
            ItemPannel,
            DetailPannel,
            TerminalBox,
            layoutDesign
        },
        extends: Editor,
        data() {
            return {
                DEFAULT_OUTPUTS: ['ts', 'status'],
                dialogOpened: false,
                showLayout: false,
                taskId: '',
                runDesign: false,
                msgList: [],
                runMsgList: [],
                layout: [],
                output: [],
                showTerminal: false,
                name: '',
                flowData: {},
                designItem: {
                    name: '',
                    _id: '',
                    flowData: {},
                    cts: '',
                    ts: ''
                },
                terminalIs: ''
            };
        },
        props: ['editorLoaded'],
        computed: {
            readMode() {
                return this.$route.params.read;
            }
        },
        beforeDestroy() {
            window.onbeforeunload = null;
            this.editor && this.editor.destroy();
            this.deleteTestTask()
        },
        async mounted() {
            window.onbeforeunload = async (event) => {
                await this.deleteTestTask();
                event.returnValue = '确定退出当前页面吗?';
            };
            await this.editorLoaded;
            const params = this.$route.params;
            this.init(params)
            if (params.flow) {
                this.designItem = params.flow;
                this.flowData = JSON.parse(JSON.stringify(params.flow.flowData));
                this.name = params.flow.name;
                this.readData();
                if (params.flow.layout) {
                    this.layout = JSON.parse(JSON.stringify(params.flow.layout));
                }
                if (params.flow.output) {
                    this.output = JSON.parse(JSON.stringify(params.flow.output));
                }
                if (params.flow.task_id) {
                    this.taskId = params.flow.task_id;
                }
            }

            this.flow.changeAddEdgeModel({
                shape: 'flow-polyline-round'
            });

        },
        methods: {
            loadingUi() {
                return this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            },
            terminalFor(component) {
                this.showTerminal = true;
                this.terminalIs = component;
                $('.context-menu', this.$el).hide();
                this.$nextTick(() => {
                    this.terminalIs = ''
                })
            },
            ctrl192() {
                this.showTerminal = !this.showTerminal;
            },
            goBack(bol) {
                if (bol) {
                    this.$nextTick(async () => {
                        await this.deleteTestTask();
                        this.$router.go(-1)
                    })
                    return;
                }
                if (!this.isEdited()) {
                    this.$nextTick(async () => {
                        await this.deleteTestTask();
                        this.$router.go(-1)
                    })
                    return;
                }
                this.$confirm('确认放弃修改当前流程?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$nextTick(async () => {
                        await this.deleteTestTask();
                        this.$router.go(-1)
                    })
                })
            },
            readData() {
                if (!this.flow) return;
                this.pushMsg(this.flowData)
                this.flow.read(this.flowData)
            },
            isEdited() {
                if (!this.flow) return false;
                const editData = JSON.stringify({ flowData: this.flow.save(), name: this.name, layout: this.layout, output: this.output });
                const cacheFlowData = { ...this.designItem.flowData };
                delete cacheFlowData.disabled;
                const cacheData = JSON.stringify({ flowData: cacheFlowData, name: this.designItem.name, layout: this.designItem.layout, output: this.designItem.output });
                if (editData === cacheData) {
                    return false;
                }
                return true;
            },
            saveData() {
                if (!this.isEdited()) {
                    this.$message({
                        message: '流程并没有更改！',
                        type: 'warning'
                    })
                    return;
                }
                this.$confirm('确认保存当前流程?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.saveDesign();
                })
            },
            async saveDesign() {
                const loading = this.loadingUi();
                try {
                    if (!this.designItem._id) {
                        Object.assign(this.designItem, {
                            ts: new Date().getTime(),
                            cts: new Date().getTime(),
                            name: this.name,
                            flowData: this.flow.save(),
                            active: false
                        })
                        await this.$request.workflow.postWorkflow(this.designItem);
                    } else {
                        Object.assign(this.designItem, { name: this.name, flowData: this.flow.save(), ts: new Date().getTime(), layout: this.layout, output: this.output })
                        await this.$request.workflow.patchWorkflow(this.designItem._id, this.designItem);
                    }
                    this.$nextTick(async () => {
                        await this.deleteTestTask()
                        this.$router.push({ path: '/design/designList' })
                    })
                } catch (error) {
                    this.$message({
                        type: 'error',
                        message: '保存失败！'
                    })
                    throw error;
                } finally {
                    loading.close();
                }
            },
            changeEage(type) {
                this.flow.changeAddEdgeModel({
                    shape: type
                });
            },
            async creatTestTask() {
                // 创建test|task
                const loading = this.loadingUi();
                try {
                    const flowData = this.flow.save();
                    const creatTask = await this.$request.task.postTask({
                        flowData
                    })
                    this.taskId = creatTask.data;
                    this.runDesign = true;
                } catch (error) {
                    this.$message({
                        message: `开启任务失败! ${error}`,
                        type: 'error'
                    })
                    throw error;
                } finally {
                    loading.close();
                }
            },
            async deleteTestTask() {
                if (!this.taskId) return;
                if (this.taskId === this.designItem.task_id) return;
                const loading = this.loadingUi();
                try {
                    await this.$request.task.deleteTestTask(this.taskId);
                    this.taskId = '';
                    this.runDesign = false;
                } catch (error) {
                    throw error;
                } finally {
                    loading.close();
                }
            }
        },
        watch: {
            '$route.params': function(p) {
                if (p.flow) {
                    this.data = p.flow.flowData;
                    this.readData();
                }
            },
            runMsgList(list) {
                if (list.length) {
                    const wsDate = list.slice(-1)[0];
                    delete wsDate.act;
                    this.output = Object.keys(wsDate);
                }
            }
        }
    };
</script>
<style lang="scss">
    .editor {
        position: relative;
        height: 100%;
        .tool-tip {
            list-style: none;
            font-size: 13px;
            background: #fff;
            color: #333;
            border-radius: 4px;
            padding: 5px 10px;
            box-shadow: 0 0 10px 0 rgb(0, 0, 0);
            .tip-title {
                color: #777;
                font-size: 15px;
                margin-bottom: 10px;
                font-weight: bold;
            }
        }
        .design-name {
            width: 100px;
        }
        ::-webkit-scrollbar {
            width: 7px;
            height: 7px;
        }
        .go-back {
            position: absolute;
            right: 0;
            top: 5px;
            z-index: 1;
            display: flex;
            color: #ccc;
            text-align: right;
            align-items: center;
            .name-input {
                margin-right: 30px;
            }
            .el-input {
                height: 36px;
                width: 160px;
                .el-input__inner {
                    height: 36px;
                    line-height: 36px;
                    background: none;
                    border: none;
                    border-radius: 0;
                    border-bottom: 1px solid #aaa;
                    color: #eee;
                }
            }
            .btns {
                width: 230px;
            }
        }
        .bottom-container {
            height: calc(100% - 52px);
            position: relative;
        }
        .pannel-title {
            height: 32px;
            background: #666;
            color: #eee;
            line-height: 32px;
            padding-left: 12px;
            font-size: 15px;
        }
        .color-picker {
            vertical-align: middle;
            margin-left: 16px;
        }
    }
</style>
