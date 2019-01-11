<template>
    <el-card class="img-stream">
        <p class="title" v-if="title">{{title}}</p>
        <img :src="url" class="img" @load="loaded" v-if="url" @error="error" :class="{visibility:!show}">
        <slot></slot>
    </el-card>
</template>
<style lang="scss">
    .img-stream {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 100%;
        &.el-card {
            border: none;
        }
        .el-card__body {
            padding: 0;
            height: 100%;
        }
        .img {
            width: 100%;
            height: 100%;
            vertical-align: top;
        }
        .visibility {
            visibility: hidden;
        }
    }
</style>
<script type="text/babel">
    export default {
        name: 'imgStream',
        data() {
            return {
                show: false,
                try: 2
            };
        },
        props: {
            url: {
                type: String,
                required: false
            },
            title: {
                type: String,
                required: false
            },
            alwaysTry: {
                required: false
            }
        },
        components: {},
        mounted() { },
        methods: {
            loaded() {
                this.show = true
                this.$emit('loaded');
            },
            error(e) {
                if (!e.target) return;
                if (!this.alwaysTry) {
                    this.try--;
                }
                if (this.try <= 0) {
                    this.$emit('error');
                    return;
                }
                setTimeout(() => {
                    let url = e.target.src;

                    if (url) {
                        const urlSplit = url.split('?');
                        if (urlSplit[2]) {
                            url = url.replace('?' + urlSplit[2], '');
                        }
                        e.target.src = `${url}?t=${Math.random()}`;
                    }
                }, 4000);
            }
        }
    };
</script>