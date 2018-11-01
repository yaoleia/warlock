<script>
    import webcam from './webcam.vue'

    export default {
        data() {
            return {
                hide: false,
                uri: null
            }
        },
        methods: {
            toggle() {
                this.hide = !this.hide;
            },
            async snapshot() {
                const { uri, timestamp } = await this.$refs.webcam.takeSnapshot();
                if (!uri) {
                    return;
                }
                this.uri = uri;
            }
        },
        components: {
            webcam
        }
    }
</script>
<template>
    <div class="jpeg-camera-test">
        <div class="btns">
            <button @click="toggle">toggle</button>
            <button @click="snapshot">snapshot</button>
        </div>
        <div v-if="!hide">
            <div class="webcam-test-box">
                <webcam class="webcam-test-box" ref="webcam"></webcam>
            </div>
            <div class="webcam-test-box">
                <img class="webcam-test-box" v-if="uri" :src="uri">
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    .jpeg-camera-test {
    	.webcam-test-box {
    		width: 309px;
    		height: 309px;
    	}
    }
</style>