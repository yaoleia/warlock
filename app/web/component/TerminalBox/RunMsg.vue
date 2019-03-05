<template>
    <div class="run-msg">
        <div class="title" v-if='taskId'>
            <!-- taskId: {{taskId}} -->
        </div>
        <ul class="active" v-if="active">
            <msg-item v-for='(value,key) in active' :key='key' :_key='key' :value='value' :showTerminal='showTerminal'></msg-item>
        </ul>
        <transition-group name="list-complete" tag="div" class="msg-list" ref="runMsgList" @mousemove.native.prevent="onHover=true" @mouseleave.native.prevent="onHover=false">
            <ul class="list-complete-item" :class="item.act?'ac':''" v-for='item in runMsgList' :key="item.ts" @click="msgClick(item)">
                <msg-item v-for='(value,key) in item' :key='key' :_key='key' :value='value' :showTerminal='showTerminal'></msg-item>
            </ul>
        </transition-group>
    </div>
</template>

<script>
    import msgItem from 'component/TerminalBox/msgItem'
    export default {
        data() {
            return {
                onHover: false,
                active: null
            };
        },
        inject: ['runMsgList', 'taskId', 'socket'],
        props: ['showTerminal', 'runDesign'],
        components: { msgItem },
        methods: {
            scrollTobottom() {
                this.$nextTick(() => {
                    const item = this.$refs.runMsgList.$el;
                    item.scrollTop = item.scrollHeight;
                })
            },
            msgClick(item) {
                this.active = item;
            }
        },
        mounted() {
            this.cacheTaskId = this.taskId;
            this.socket.on('msg', data => {
                data.act = false;
                this.runMsgList.push(data)
                if (this.onHover) return;
                this.active = data;
            });

            this.$once('hook:beforeDestroy', () => {
                this.socket.off('msg');
            })
        },
        computed: {
            serverUrl() {
                return this.$store.state.serverUrl
            }
        },
        watch: {
            active(obj) {
                this.runMsgList.forEach(l => {
                    l.act = l.ts === obj.ts;
                })
            },
            taskId: {
                handler(id, oldId) {
                    if (!oldId && !id) return;
                    if (id) {
                        if (oldId) {
                            this.socket.emit('leave', oldId)
                        }
                        this.socket.emit('join', id)
                    } else {
                        this.socket.emit('leave', oldId)
                    }
                    this.$message({
                        type: 'success',
                        message: id && id === this.cacheTaskId ? '已连接正在运行的任务！' : id ? '开启成功！' : '关闭成功！'
                    })

                },
                immediate: true
            },
            runDesign(bol) {
                this.scrollTobottom();
            },
            runMsgList(list) {
                while (list && list.length > 50) {
                    list.shift();
                }
                if (this.onHover) return;
                this.scrollTobottom();
            }
        }
    };
</script>
<style lang="scss">
    .run-msg {
        height: calc(100% - 35px);
        color: #bbb;
        .active {
            list-style: none;
            position: absolute;
            width: 58%;
            padding: 10px;
            height: 95%;
            overflow: auto;
            .feature-img-container {
                width: 480px;
                height: 300px;
            }
        }
        .status {
            font-weight: bold;
            &.ok {
                color: green;
            }
            &.ng {
                color: #f44336;
            }
        }
        .msg-list {
            margin-left: 68%;
            ul {
                cursor: pointer;
                padding: 0 10px;
                list-style: none;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                border-bottom: 1px solid #222;
                transition: 0.1 all;
                > li {
                    margin: 0;
                }
                &.ac {
                    background: #666;
                }
                &:hover {
                    background: #666;
                }
            }
            .feature-img-container {
                width: 120px;
                height: 80px;
            }
        }
    }
</style>
