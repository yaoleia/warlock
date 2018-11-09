<template>
    <div class="editor-wrap">
        <model-flow-editor />
    </div>
</template>
<style>
    .editor-wrap {
    	height: 100%;
    }
</style>
<script type="babel">
    export default {
        components: {
        },
        data() {
            return {

            };
        },
        beforeMount() {
            // 只会在浏览器执行
            this.$options.components.ModelFlowEditor = () => import("component/ModelFlowEditor")
        },
        computed: {},
        methods: {
        },
        mounted() {
        }
    };
</script>