<template>
    <div class="run-msg">
        <div class="title" v-if='taskId'>
            <!-- taskId: {{taskId}} -->
        </div>
        <ul class="active" v-if="active">
            <msg-item :item='active' :showTerminal='showTerminal'></msg-item>
        </ul>
        <transition-group name="list-complete" tag="div" class="msg-list" ref="runMsgList" @mousemove.native.prevent="onHover=true" @mouseleave.native.prevent="onHover=false">
            <ul class="list-complete-item" v-for='item in runMsgList' :key="item.ts" @click="msgClick(item)">
                <msg-item :item='item' :showTerminal='showTerminal'></msg-item>
            </ul>
        </transition-group>
    </div>
</template>

<script>
    import FeatureImg from 'component/FeatureImg'

    const msgItem = {
        data() {
            return {
            }
        },
        components: { FeatureImg },
        props: ['item', 'showTerminal'],
        template: `<li v-for='(value,key) in item' :key='key'>
                        <div v-if='key === "ts"'>
                            <p>{{key}}: {{$moment(value).format()}}</p>
                        </div>
                        <div v-else-if='key == "status"'>
                            <p>{{key}}: <span class="status" :class="value?'ok':'ng'">{{value?"OK":"NG"}}</span></p>
                        </div>
                        <div v-else-if='checkURL(value)'>
                            <p>{{key}}: </p>
                            <feature-img :src='value' ref='featureImg'></feature-img>
                        </div>
                        <div v-else>{{key}}: {{value}}</div>
                    </li>`,
        methods: {
            checkURL(URL) {
                if (typeof URL !== 'string') {
                    return false;
                }
                const str = URL;
                // 判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
                // 下面的代码中应用了转义字符"\"输出一个字符"/"
                const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                const objExp = new RegExp(Expression);
                if (objExp.test(str) == true) {
                    return true;
                } else {
                    return false;
                }
            },
        },
        watch: {
            showTerminal(bol) {
                const imgs = this.$refs.featureImg;
                console.log(imgs)
                if (!bol || !imgs) return;
                imgs.forEach(i => {
                    const $imgWrap = i.$refs.imgWrap;
                    if ($imgWrap.clientHeight) return;
                    i.onImgLoad();
                })
            }
        }
    }

    export default {
        data() {
            return {
                onHover: false,
                active: null
            };
        },
        components: { msgItem },
        props: ['showTerminal', 'runDesign', 'taskId', 'runMsgList'],
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
        watch: {
            taskId(id) {
                window.ws.off('msg').emit('chat', id).on('msg', m => {
                    this.runMsgList.push(m)
                    if (this.onHover) return;
                    this.active = m;
                })
                this.$message({
                    type: 'success',
                    message: id ? '启动成功！' : '关闭成功！'
                })
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
                    margin-right: 20px;
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
