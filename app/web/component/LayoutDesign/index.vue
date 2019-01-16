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
                        <component v-if='dialogOpened' :is='component.name' v-bind="getProps(component.props)"></component>
                    </li>
                </ul>
            </div>
        </draggable>
        <draggable class="layout" :options="layoutOptions" @mousemove.native.prevent="mousemove">
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
                        <component v-if='dialogOpened' :is='element.name' v-bind="getProps(element.props,element.editProps)" :width='element.width' :height='element.height'></component>
                        <div class="change-size" @mousedown.prevent.stop="sizeMousedown($event,element)" @mouseenter.prevent.stop></div>
                    </li>
                </ul>
            </div>
        </draggable>
        <el-dialog title='组件参数' custom-class='dialog-props' :visible.sync="dialogPropsVisible" :append-to-body='true' :modal='false' width="500px">
            <dialog-props v-if='curElement' :curElement='curElement' :output='output'></dialog-props>
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
        props: ['runMsgList', 'layout', 'dialogOpened', 'output'],
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
                wsDate: {},
                defaultConfig: { testUrl: 'https://static.jsbin.com/images/dave.min.svg', title: 'wade' },
                leftMouse: {
                    getEvt: false,
                    evt: null,
                    downTL: null,
                    reset() {
                        this.getEvt = false;
                        this.evt = null;
                        this.downTL = null;
                    }
                },
                componentOptions: {
                    group: {
                        name: 'wade',
                        pull: false,
                        put: false
                    },
                    forceFallback: true,
                    handle: '.handle',
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
                document.onmousemove = ev => {
                    this.sizeMousemove(ev, element, downObj)
                    ev.preventDefault()
                }
                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    downObj = null;
                }
            },
            sizeMousemove(e, element, downObj) {
                const X = e.clientX - downObj.e.clientX
                const Y = e.clientY - downObj.e.clientY
                const width = downObj.width + X;
                const height = downObj.height + Y;
                element.width = width > 150 ? width : 150;
                element.height = height > 150 ? height : 150;
            },
            close(index) {
                this.$delete(this.layout, index)
            },
            imousedown(e, element) {
                // 对已经添加的mousedown
                if (e.button !== 0) return;
                const $layout = $('.layout', this.$el);
                let downObj = {};
                Object.assign(
                    downObj,
                    {
                        x: element.left - e.clientX,
                        y: element.top - e.clientY,
                        maxLeft: $layout.width() - element.width,
                        maxTop: $layout.height() - element.height
                    }
                )

                document.onmousemove = ev => {
                    this.imousemove(ev, element, downObj)
                    ev.preventDefault()
                }
                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    downObj = null;
                }
            },
            imousemove(ev, element, downObj) {
                // 对已经添加的组件的拖动
                let top = downObj.y + ev.clientY;
                let left = downObj.x + ev.clientX;
                if (top < 0) {
                    top = 0;
                }
                if (top > downObj.maxTop) {
                    top = downObj.maxTop
                }

                if (left < 0) {
                    left = 0;
                }
                if (left > downObj.maxLeft) {
                    left = downObj.maxLeft
                }
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
            mousedown(e) {
                // 从左侧列表拉进来的mousedown
                if (e.button !== 0) return;
                this.leftMouse.getEvt = true;
                const $target = $(e.target);
                const layoutOffset = $('.layout', this.$el).offset();
                const targetOffset = $target.offset();
                const top = e.clientY - targetOffset.top - $target.height() + layoutOffset.top;
                const left = e.clientX - targetOffset.left + layoutOffset.left;
                this.leftMouse.downTL = { top, left };
            },
            mousemove(e) {
                if (!this.leftMouse.getEvt) return;
                this.leftMouse.evt = {
                    clientY: e.clientY,
                    clientX: e.clientX
                };
            },
            end(e) {
                if (!this.leftMouse.evt) {
                    this.leftMouse.reset();
                    return;
                }
                let top = this.leftMouse.evt.clientY - this.leftMouse.downTL.top;
                let left = this.leftMouse.evt.clientX - this.leftMouse.downTL.left;
                const cloneItem = _.cloneDeep(this.components[e.oldIndex])
                const editProps = cloneItem.props;
                if (top < 0) {
                    top = 0;
                }
                if (left < 0) {
                    left = 0;
                }
                const item = { ...cloneItem, top, left, editProps, width: 300, height: 300, id: shortid.generate() }
                this.layout.push(item)
                this.leftMouse.reset();
            }
        },
        mounted() {
            if (this.runMsgList.length) {
                this.wsDate = this.runMsgList.slice(-1)[0];
            }
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
            width: 330px;
            height: 100%;
            max-height: 1082px;
            padding: 30px 10px 0;
            flex-shrink: 0;
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
            .component-wrap {
                height: 100%;
                overflow: hidden;
                background: rgba(255, 255, 255, 0.06);
                border-radius: 10px;
            }
        }
        .layout {
            flex-shrink: 0;
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
                    transition: all 0.2s;
                    opacity: 0.3;
                    color: #999;
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
                    &:hover {
                        opacity: 1;
                    }
                    .btns {
                        > * {
                            transition: all 0.2s;
                            padding: 5px;
                            margin: -5px -3px;
                        }
                        > *:hover {
                            color: #ff8800;
                        }
                    }
                }
            }
        }
    }
</style>
