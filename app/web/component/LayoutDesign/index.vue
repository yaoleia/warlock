<template>
    <div class="layout-design">
        <draggable class="component-list" :list="components" :options='componentOptions' @end="end">
            <div :class='component.name+"-component"' v-for="component in components" :key="component.name" @mousedown.prevent="mousedown">
                <ul>
                    <li class="handle">
                        <span>{{component.name}}</span>
                        <v-icon name='move'></v-icon>
                    </li>
                    <li class="component-wrap">
                        <component :is='component.name' v-bind="getProps(component.props)"></component>
                    </li>
                </ul>
            </div>
        </draggable>
        <draggable v-model="layout" class="layout" :options="layoutOptions" @mousemove.native.prevent="mousemove" @mouseleave.native.prevent="leftMouse.getEvt=false">
            <div :class='element.name' v-for="(element,index) in layout" :key="element.id" :style="{top:element.top+'px',left:element.left+'px',width:element.width+'px',height:element.height+'px'}">
                <ul>
                    <li class="name" @mousedown.prevent.stop="imousedown($event, element)">
                        <span>{{element.name}}</span>
                        <div class="btns" @mousedown.stop>
                            <v-icon class="edit-props" name='xiugaitupian' @click.stop="showProps($event,element)"></v-icon>
                            <div class="close el-icon-close" @click.stop="close(index)"></div>
                        </div>
                    </li>
                    <li class="component-body">
                        <component :is='element.name' v-bind="getProps(element.props,element.editProps)" :width='element.width' :height='element.height'></component>
                        <div class="change-size" @mousedown.prevent.stop="sizeMousedown($event,element)" @mouseenter.prevent.stop></div>
                    </li>
                </ul>
            </div>
        </draggable>
        <el-dialog title='组件参数' custom-class='dialog-props' :visible.sync="dialogPropsVisible" :append-to-body='true' :modal='false' width="500px">
            <dialog-props v-if='curElement' :curElement='curElement' :wsDate='wsDate'></dialog-props>
        </el-dialog>
    </div>
</template>
<script type="babel">
    import draggable from 'vuedraggable'
    import imgStream from 'component/imgStream'
    import magnifier from 'component/magnifier'
    import dialogProps from './dialogProps'
    import shortid from 'shortid'
    import _ from 'lodash';

    export default {
        components: {
            draggable,
            imgStream,
            magnifier,
            dialogProps
        },
        props: ['runMsgList', 'layout'],
        beforeMount() {
            // 只会在浏览器执行
            this.$options.components.webcam = () => import('component/webcam')
        },
        data() {
            return {
                curElement: null,
                dialogPropsVisible: false,
                components: [
                    { name: 'imgStream', props: imgStream.props },
                    { name: 'magnifier', props: magnifier.props },
                    { name: 'webcam' }
                ],
                canI: false,
                wsDate: {},
                defaultConfig: { testUrl: 'https://static.jsbin.com/images/dave.min.svg', title: 'wade' },
                leftMouse: {
                    getEvt: false,
                    evt: null,
                    downTL: null
                },
                rightMouse: {
                    evt: null,
                    downTL: null
                },
                componentOptions: {
                    group: {
                        name: 'wade',
                        pull: false,
                        put: false
                    },
                    forceFallback: true,
                    handle: '.handle',
                    animation: 300,
                    sort: false
                },
                layoutOptions: {
                    group: 'wade',
                    handle: '.handle',
                    sort: false
                }
            };
        },
        watch: {
            runMsgList(list) {
                const newItem = list.slice(-1)[0];
                for (const key in newItem) {
                    if (newItem.hasOwnProperty(key)) {
                        const element = newItem[key];
                        this.$set(this.wsDate, key, element);
                    }
                }
            }
        },
        methods: {
            showProps(e, element) {
                this.curElement = element;
                this.dialogPropsVisible = true;
            },
            sizeMousedown(e, element) {
                if (e.button !== 0) return;
                let downObj = {}
                downObj.e = e;
                downObj.width = element.width;
                downObj.height = element.height;
                this.canI = true;
                document.onmousemove = ev => {
                    if (!this.canI) return;
                    this.sizeMousemove(ev, element, downObj)
                    ev.preventDefault()
                }
                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    this.canI = false;
                    downObj = null;
                }
            },
            sizeMousemove(e, element, downObj) {
                const X = e.clientX - downObj.e.clientX
                const Y = e.clientY - downObj.e.clientY
                element.width = downObj.width + X
                element.height = downObj.height + Y;
            },
            close(index) {
                this.$delete(this.layout, index)
            },
            imousedown(e, element) {
                if (e.button !== 0) return;
                const target = e.target;
                const targetOffset = $(target).offset();
                const top = e.clientY - targetOffset.top;
                const left = e.clientX - targetOffset.left;
                this.rightMouse.downTL = { top, left };

                document.onmousemove = ev => {
                    this.imousemove(ev, element)
                    ev.preventDefault()
                }
                document.onmouseup = () => {
                    document.onmousemove = null
                    document.onmouseup = null
                }
            },
            imousemove(ev, element) {
                const layoutOffset = $('.layout', this.$el).offset();
                const top = ev.clientY - layoutOffset.top + 30 - this.rightMouse.downTL.top;
                const left = ev.clientX - layoutOffset.left - this.rightMouse.downTL.left;
                element.top = top;
                element.left = left;
            },
            getProps(props, editProps) {
                const p = {}
                if (!props) return p;
                for (const key in props) {
                    if (props.hasOwnProperty(key)) {
                        const element = props[key];
                        const bind = editProps && editProps[key].bind;
                        if (!editProps) {
                            p[key] = this.defaultConfig[key] || this.defaultConfig.testUrl;
                            continue;
                        }
                        if (editProps[key].switch) {
                            p[key] = bind
                            continue;
                        }
                        p[key] = this.wsDate[bind] || this.defaultConfig[key] || this.defaultConfig.testUrl;
                    }
                }
                return p;
            },
            end(e) {
                const layoutOffset = $('.layout', this.$el).offset();
                const top = this.leftMouse.evt.clientY - layoutOffset.top;
                const left = this.leftMouse.evt.clientX - layoutOffset.left;
                const cloneItem = _.cloneDeep(this.components[e.oldIndex])
                const editProps = _.cloneDeep(cloneItem.props)
                const item = { ...cloneItem, top: top - this.leftMouse.downTL.top + 30, left: left - this.leftMouse.downTL.left, editProps, width: 300, height: 300 }
                item.id = shortid.generate();
                this.layout.push(item)
            },
            mousedown(e) {
                if (e.button !== 0) return;
                const target = e.target;
                const targetOffset = $(target).offset();
                const top = e.clientY - targetOffset.top;
                const left = e.clientX - targetOffset.left;
                this.leftMouse.downTL = { top, left };
            },
            mousemove(e) {
                this.leftMouse.getEvt = true;
                this.leftMouse.evt = e;
            }
        },
        mounted() {
        }
    };
</script>
<style lang="scss">
    .layout-pop-dialog {
        background-image: linear-gradient(to bottom, #2d2d2d, #252121);
        .el-dialog__body {
            height: calc(100% - 54px);
        }
        .el-dialog__title {
            color: #ddd;
        }
    }
    .layout-design {
        height: 100%;
        display: flex;
        ul {
            list-style: none;
        }
        .img-stream {
            background: none;
            p.title {
                font-size: 20px;
                line-height: 66px;
                position: absolute;
                left: 30px;
                top: 0;
                z-index: 5;
                color: #9c9c9c;
            }
        }
        .component-list {
            overflow: auto;
            overflow-x: hidden;
            width: 350px;
            height: 100%;
            padding: 30px 10px 0;
            > div {
                width: 300px;
                height: 300px;
                margin-bottom: 40px;
                position: relative;
            }
            .handle {
                position: absolute;
                top: -30px;
                cursor: move;
                color: #999;
                padding-left: 10px;
                width: 100%;
                line-height: 30px;
                display: flex;
                justify-content: space-between;
            }
            ul {
                height: 100%;
            }
            .webcam-component {
                height: 200px;
            }
            .component-wrap {
                height: 100%;
                overflow: hidden;
                background: rgba(255, 255, 255, 0.06);
                border-radius: 10px;
            }
        }
        .layout {
            position: relative;
            margin: 0 50px;
            width: 1340px;
            height: 1082px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.06);
            .webcam {
                > ul {
                    width: 100%;
                    height: 100%;
                    .component-body {
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                    }
                }
            }
            .component-body {
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.06);
                height: 100%;
                position: relative;
                > div,
                .img-stream {
                    background: none;
                }
                .change-size {
                    position: absolute;
                    right: -10px;
                    bottom: -10px;
                    width: 24px;
                    height: 24px;
                    cursor: nwse-resize;
                }
            }
            > div {
                position: absolute;
                left: 0;
                top: 0;
                width: 300px;
                height: 300px;
                ul {
                    height: 100%;
                }
                li.name {
                    position: absolute;
                    top: -30px;
                    left: 0;
                    width: 100%;
                    padding-left: 10px;
                    line-height: 30px;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    .el-icon-close {
                        cursor: pointer;
                        font-size: initial;
                        color: inherit;
                        opacity: inherit;
                        position: relative;
                    }
                    .edit-props {
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>
