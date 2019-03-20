<template>
    <div class="editor-wrap">
        <model-flow-editor v-bind='$attrs' />
    </div>
</template>
<script type="babel">
    export default {
        components: {
            modelFlowEditor: () => import('component/modelFlowEditor')
        }
    };
</script>
