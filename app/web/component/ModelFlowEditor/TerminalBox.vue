<template>
    <transition name="el-zoom-in-bottom">
        <div v-show="showTerminal" class="terminal-box">
            <el-button type="text" icon="el-icon-close" class="close-button" @click="$emit('update:showTerminal',false)"></el-button>
            <ul class="msg-list" ref="msgList">
                <li v-for="(item,index) in msgList" :key="index">{{item}}</li>
            </ul>
        </div>
    </transition>
</template>

<script>
    export default {
        data() {
            return {
            };
        },
        props: ['showTerminal', 'msgList'],
        watch: {
            msgList(list) {
                if (!list.length) return;
                while (list.length > 100) {
                    list.shift();
                }
                this.$nextTick(() => {
                    const item = this.$refs.msgList;
                    item.scrollTop = item.scrollHeight;
                })
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
        background: rgba($color: #555, $alpha: 0.9);
        line-height: 34px;
        padding: 5px 10px;
        .msg-list {
            overflow: auto;
            height: 100%;
            font-size: 15px;
            line-height: 25px;
            color: #eee;
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
