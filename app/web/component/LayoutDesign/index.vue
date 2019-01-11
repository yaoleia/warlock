<template>
    <div class="layout-design">
        <draggable class="component-list" :list="components" :options='componentOptions' @end="end">
            <div v-for="component in components" :key="component.name" @mousedown.prevent="mousedown">
                <ul>
                    <li class="handle">{{component.name}}</li>
                    <li>
                        <component :is='component.name' v-bind="getProps(component.props)"></component>
                    </li>
                </ul>
            </div>
            {{layout}}
        </draggable>
        <draggable v-model="layout" class="layout" :options="layoutOptions" @mousemove.native.prevent="mousemove" @mouseleave.native.prevent="leftMouse.getEvt=false">
            <div v-for="(element,index) in layout" :key="element.id" :style="{top:element.top+'px',left:element.left+'px',width:element.width+'px',height:element.height+'px'}">
                <ul>
                    <li class="name" @mousedown.prevent.stop="imousedown($event, element)">
                        <span>{{element.name}}</span>
                        <div class="close el-icon-close" @mousedown.stop @click.stop="close(index)"></div>
                    </li>
                    <li class="props">
                        <div v-for="(value,key) in element.editProps" :key='key'>
                            {{key}}:
                            <el-select v-if='!element.editProps[key].switch' v-model="element.editProps[key].bind" placeholder="请选择" clearable>
                                <el-option v-for="(item,key) in wsDate" :key="key" :label="key" :value="key">
                                </el-option>
                            </el-select>
                            <el-autocomplete v-else class="inline-input" v-model="element.editProps[key].bind" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
                            <el-switch v-model="element.editProps[key].switch"></el-switch>
                        </div>
                        <div class="block">
                            <span>width:</span>
                            <el-slider v-model="element.width" show-input :max='1000' :min="100"></el-slider>
                        </div>
                        <div class="block">
                            <span>height:</span>
                            <el-slider v-model="element.height" show-input :max='1000' :min="100"></el-slider>
                        </div>
                    </li>
                    <li class="component-body">
                        <component :is='element.name' v-bind="getProps(element.props,element.editProps)" :width='element.width' :height='element.height'></component>
                    </li>
                </ul>
            </div>
        </draggable>
    </div>
</template>
<script type="babel">
    import draggable from 'vuedraggable'
    import imgStream from 'component/imgStream'
    import magnifier from 'component/magnifier'
    import shortid from 'shortid'
    import _ from 'lodash';

    export default {
        components: {
            draggable,
            imgStream,
            magnifier
        },
        props: ['runMsgList', 'layout'],
        beforeMount() {
            // 只会在浏览器执行
            this.$options.components.webcam = () => import('component/webcam')
        },
        data() {
            return {
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
            querySearch(queryString, cb) {
                const result = Object.keys(this.wsDate).map(k => ({ value: k }))
                cb(result)
            },
            close(index) {
                this.$delete(this.layout, index)
            },
            imousedown(e, element) {
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
                const top = ev.clientY - layoutOffset.top + 20 - this.rightMouse.downTL.top;
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
                const item = { ...cloneItem, top: top - this.leftMouse.downTL.top, left: left - this.leftMouse.downTL.left, editProps, width: 300, height: 300 }
                item.id = shortid.generate();
                this.layout.push(item)
            },
            mousedown(e) {
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
        .el-dialog__body {
            height: calc(100% - 54px);
        }
    }
    .layout-design {
        height: 100%;
        display: flex;
        ul {
            list-style: none;
        }
        .component-list {
            overflow: auto;
            width: 350px;
            height: 100%;
            > div {
                // display: inline-block;
            }
            .handle {
                background: red;
            }
        }
        .layout {
            position: relative;
            margin: 0 50px;
            width: 1380px;
            height: 1082px;
            border-radius: 20px;
            background: #bbb;
            > div {
                position: absolute;
                left: 0;
                top: 0;
                width: 300px;
                height: 300px;
                background: #ccc;
                ul {
                    height: 100%;
                }
                li.name {
                    position: absolute;
                    top: -20px;
                    left: 0;
                    width: 100%;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    .close {
                        cursor: pointer;
                    }
                }
                &:hover {
                    .props {
                        opacity: 1;
                    }
                }
                .props {
                    transition: 0.3s all;
                    opacity: 0;
                    position: absolute;
                    width: 300px;
                    padding: 10px;
                    left: 0;
                    top: 0;
                    z-index: 10;
                    color: #eee;
                    background: rgba($color: #000000, $alpha: 0.7);
                }
            }
            .sortable-chosen {
                // display: none;
            }
        }
    }
</style>
