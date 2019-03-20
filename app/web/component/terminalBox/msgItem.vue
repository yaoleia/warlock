<template>
    <li class='msg-item'>
        <div v-if='_key === "ts"'>
            <p>{{_key}}: {{$dateFns.format(value,'YYYY-MM-DD HH:mm:ss')}}</p>
        </div>
        <div v-else-if='_key === "status"'>
            <p>{{_key}}: <span class="status" :class="value?'ok':'ng'">{{value?"OK":"NG"}}</span></p>
        </div>
        <div v-else-if='checkURL(value)'>
            <p>{{_key}}: </p>
            <feature-img :src='value' ref='featureImg'></feature-img>
        </div>
        <div v-else-if='_key!=="act"'>{{_key}}: {{value}}</div>
    </li>
</template>

<script>
    import featureImg from 'component/featureImg'

    export default {
        data() {
            return {
            }
        },
        components: { featureImg },
        props: ['_key', 'value', 'showTerminal'],
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
                if (!bol || !imgs) return;
                const $imgWrap = imgs.$refs.imgWrap;
                imgs.onImgLoad();
            }
        }
    };
</script>
<style lang="scss">
    .msg-item {
        .feature-img-container {
            width: 120px;
            height: 80px;
        }
    }
</style>
