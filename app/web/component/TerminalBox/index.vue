<template>
    <transition name="el-zoom-in-center">
        <div v-show="showTerminal" class="terminal-box" @contextmenu.prevent='contextMenu' @click="showContextMenu=false">
            <el-button type="text" icon="el-icon-close" class="close-button" @click="$emit('update:showTerminal',false)"></el-button>
            <div class="zoom-btn" @mousedown.prevent="mousedown"></div>
            <div class="context-menu-terminal" v-show="showContextMenu">
                <el-button type="text" size="small" @click.stop="clearMsgList"><i class="el-icon-delete"></i> 清空</el-button>
            </div>
            <div class="radio-wrap" @contextmenu.stop.prevent>
                <el-button type="text" :class="componentIs=='output'?'active':''" @click="componentIs='output'">
                    <v-icon name="console" />
                </el-button>
                <el-button type="text" :class="componentIs=='run'?'active':''" @click="runClick">
                    <v-icon v-if='!runDesign' name="play" />
                    <v-icon v-else name="stop" />
                </el-button>
            </div>
            <keep-alive>
                <component :is='componentIs+"-msg"' :msgList='msgList' :runDesign='runDesign' :runMsgList='runMsgList' :taskId='taskId' :showTerminal='showTerminal'></component>
            </keep-alive>
        </div>
    </transition>
</template>

<script>
    import runMsg from './RunMsg'
    const outputMsg = {
        data() {
            return {
            }
        },
        props: ['msgList', 'showTerminal'],
        template: `<transition-group name="list-complete" tag="ul" class="msg-list" ref="msgList">
                <li class="list-complete-item" v-for="item in msgList" :key="item.ts">> {{item.msg}}</li>
            </transition-group>`,
        methods: {
            scrollTobottom() {
                this.$nextTick(() => {
                    const item = this.$refs.msgList.$el;
                    item.scrollTop = item.scrollHeight;
                })
            },
        },
        watch: {
            msgList(list) {
                if (!list.length) return;
                while (list.length > 100) {
                    list.shift();
                }
                this.scrollTobottom();
            },
            showTerminal(bol) {
                if (bol) {
                    this.scrollTobottom();
                }
            }
        }
    }

    export default {
        data() {
            return {
                showContextMenu: false,
                canMove: false,
                mouse: {},
                componentIs: 'output'
            };
        },
        components: {
            outputMsg,
            runMsg
        },
        props: ['showTerminal', 'msgList', 'terminalIs', 'runDesign', 'taskId', 'runMsgList'],
        watch: {
            terminalIs(s) {
                if (s) {
                    this.componentIs = s;
                }
            }
        },
        mounted() {
            $(window).on(`resize.${this._uid}`, this.onResize)
        },
        beforeDestroy() {
            $(window).off(`resize.${this._uid}`)
        },
        methods: {
            onResize() {
                const $el = $(this.$el);
                let height = this.$el.clientHeight;
                const parentHeight = this.$parent.$el.clientHeight - 50;
                if (parentHeight >= height) return;
                height = parentHeight;
                $el.css({ height });
            },
            runClick() {
                if (this.componentIs === 'run') {
                    if (this.runDesign) {
                        this.$emit('stop')
                    } else {
                        this.$emit('start')
                    }
                }
                this.componentIs = 'run';
            },
            contextMenu(e) {
                this.showContextMenu = true;
                const $elOffset = $(this.$el).offset();
                $('.context-menu-terminal', this.$el).css({ left: e.clientX - $elOffset.left, top: e.clientY - $elOffset.top })
            },
            clearMsgList() {
                this.showContextMenu = false;
                if (this.componentIs === 'output') {
                    this.$emit('update:msgList', [])
                } else {
                    this.runMsgList.splice(0, this.runMsgList.length);
                }
            },
            mousemove(e) {
                const { diffH } = this.mouse;
                const $el = $(this.$el);
                const t = e.clientY - $el.offset().top - diffH;
                let height = this.$el.clientHeight - t;
                if (height < 0) { height = 0 }
                const parentHeight = this.$parent.$el.clientHeight - 50;
                if (parentHeight < height) {
                    height = parentHeight
                }
                $el.css({ height })
            },
            mousedown(e) {
                this.canMove = true;
                const $elT = $(this.$el).offset().top;
                const diffH = e.clientY - $elT;
                this.mouse = { diffH }
                document.onmousemove = ev => {
                    if (!this.canMove) return;
                    this.mousemove(ev)
                    ev.preventDefault()
                }
                document.onmouseup = () => {
                    document.onmousemove = null
                    this.canMove = false;
                    document.onmouseup = null
                }
            }
        }
    };
</script>
<style lang="scss">
    .terminal-box {
        position: absolute;
        bottom: 0;
        left: 200px;
        right: 260px;
        height: 200px;
        background: rgba($color: #333, $alpha: 0.9);
        line-height: 34px;
        padding: 5px 10px 5px 60px;
        box-shadow: 0 4px 8px 0 rgb(0, 0, 0);
        .radio-wrap {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: #444;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 2px 2px 6px 0 rgb(0, 0, 0);
            .el-button {
                padding: 20px 10px;
                border-radius: 0;
                border: none;
                border-right: 2px solid transparent;
                margin: 0;
                &.active {
                    border-color: #ff8800;
                }
                .v-icon {
                    font-size: 20px;
                    &.v-icon-stop {
                        color: #ff8800;
                        transition: 0.3s all;
                    }
                }
            }
        }
        .context-menu-terminal {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            background: #fff;
            padding: 0 20px;
            border-radius: 4px;
            .el-button--text {
                color: #333;
            }
            &:hover {
                .el-button--text {
                    color: #ff8800;
                }
            }
        }
        ::selection {
            background: #ff8800;
        }
        .zoom-btn {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            margin: auto;
            width: 80px;
            border-bottom: 2px solid #bbb;
            height: 6px;
            background: #000;
            cursor: ns-resize;
            box-shadow: 0 3px 8px 0 rgb(0, 0, 0);
        }
        .msg-list {
            overflow: auto;
            height: 100%;
            font-size: 14px;
            line-height: 27px;
            color: #bbb;
            font-weight: normal;
            li {
                margin-bottom: 10px;
                word-break: break-word;
            }
        }
        .close-button {
            position: absolute;
            right: 0;
            top: 0;
            padding: 10px 20px;
            font-size: 24px;
        }
    }
</style>
