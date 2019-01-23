<template>
    <div class="editor-page"></div>
</template>

<script>

    export default {
        data() {
            return {
                name: 'page'
            };
        }
    };
</script>
<style lang="scss">
    .editor-page {
        border: 1px solid #444;
        height: 100%;
        margin-left: 200px;
        margin-right: 260px;
        canvas {
            display: block;
        }
    }
</style>
