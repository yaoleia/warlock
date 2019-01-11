<template>
    <div class="editor-wrap">
        <model-flow-editor v-bind='$attrs' />
    </div>
</template>
<script type="babel">
    export default {
        data() {
            return {
            };
        },
        beforeMount() {
            // 只会在浏览器执行
            this.$options.components.ModelFlowEditor = () => import('component/ModelFlowEditor')
        },
        computed: {},
        methods: {
        },
        mounted() {
        }
    };
</script>
