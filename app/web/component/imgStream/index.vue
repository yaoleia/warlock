<template>
    <el-card class="img-stream">
        <p class="title" v-if="title">{{title}}</p>
        <feature-img :src="url" @loaded="loaded" @error="error"></feature-img>
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
        .feature-img-container {
            width: 100%;
            height: 100%;
        }
    }
</style>
<script type="text/babel">
    import FeatureImg from 'component/FeatureImg'
    export default {
        name: 'imgStream',
        data() {
            return {
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
        components: {
            FeatureImg
        },
        mounted() { },
        methods: {
            loaded() {
                this.$emit('loaded');
            },
            error(e) {
                if (!e.target || !this.url) return;
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
