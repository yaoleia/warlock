<template>
    <div class="run-msg">
        <div class="title" v-if='taskId'>
            taskId: {{taskId}}
        </div>
        <transition-group name="list-complete" tag="div" class="msg-list" ref="msgList">
            <ul class="list-complete-item" v-for='(li,index) in runMsgList' :key='index'>
                <li v-for='(value,key) in li' :key='key'>
                    <div v-if='checkURL(value)'>
                        <p>{{key}}: </p>
                        <feature-img :src='value'></feature-img>
                    </div>
                    <div v-else>{{key}}: {{value}}</div>
                </li>
            </ul>
        </transition-group>
    </div>
</template>

<script>
    import FeatureImg from 'component/FeatureImg'
    export default {
        data() {
            return {
            };
        },
        components: { FeatureImg },
        props: ['runDesign', 'taskId', 'runMsgList'],
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
            scrollTobottom() {
                this.$nextTick(() => {
                    const item = this.$refs.msgList.$el;
                    item.scrollTop = item.scrollHeight;
                })
            }
        },
        watch: {
            taskId(id) {
                window.ws.off('msg').emit('chat', id).on('msg', m => {
                    this.runMsgList.push(m)
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
                this.scrollTobottom();
            }
        }
    };
</script>
<style lang="scss">
    .run-msg {
        height: calc(100% - 35px);
        color: #eee;
        .msg-list {
            ul {
                list-style: none;
                display: flex;
                border-bottom: 1px solid #222;
                > li {
                    margin-right: 20px;
                }
            }
            .feature-img-container {
                width: 400px;
                height: 260px;
            }
        }
    }
</style>
