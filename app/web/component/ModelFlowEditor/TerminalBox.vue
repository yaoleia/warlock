<template>
    <transition name="el-zoom-in-center">
        <div v-show="showTerminal" class="terminal-box" @contextmenu.prevent='contextMenu' @click="showContextMenu=false">
            <el-button type="text" icon="el-icon-close" class="close-button" @click="$emit('update:showTerminal',false)"></el-button>
            <div class="zoom-btn" @mousedown.prevent="mousedown"></div>
            <div class="context-menu-terminal" v-show="showContextMenu">
                <el-button type="text" size="small" @click.stop="clearMsgList"><i class="el-icon-delete"></i> 清空</el-button>
            </div>
            <transition-group name="list-complete" tag="ul" class="msg-list" ref="msgList">
                <li class="list-complete-item" v-for="(item,index) in msgList" :key="index">> {{item}}</li>
            </transition-group>
        </div>
    </transition>
</template>

<script>
    export default {
        data() {
            return {
                showContextMenu: false,
                canMove: false,
                mouse: {}
            };
        },
        props: ['showTerminal', 'msgList'],
        methods: {
            contextMenu(e) {
                this.showContextMenu = true;
                const $elOffset = $(this.$el).offset();
                $('.context-menu-terminal', this.$el).css({ left: e.clientX - $elOffset.left, top: e.clientY - $elOffset.top })
            },
            clearMsgList() {
                this.showContextMenu = false;
                this.$emit('update:msgList', [])
            },
            scrollTobottom() {
                this.$nextTick(() => {
                    const item = this.$refs.msgList.$el;
                    item.scrollTop = item.scrollHeight;
                })
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
    };
</script>
<style lang="scss">
    .terminal-box {
        position: absolute;
        bottom: 0;
        left: 200px;
        right: 200px;
        height: 182px;
        background: rgba($color: #333, $alpha: 0.9);
        line-height: 34px;
        padding: 5px 10px;
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
        }
        .msg-list {
            overflow: auto;
            height: 100%;
            font-size: 15px;
            line-height: 25px;
            color: #eee;
            li {
                margin-bottom: 5px;
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
