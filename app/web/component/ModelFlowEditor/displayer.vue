<template>
    <div ref="display" />
</template>

<script>
    export default {
        props: {
            flowData: {
                type: Object
            }
        },
        methods: {
            async init() {
                const G6Editor = await import('@antv/g6-editor')
                const editor = new G6Editor.Editor();
                const page = new G6Editor.Flow({
                    graph: {
                        container: this.$refs.display,
                        mode: 'read',
                        fitView: 'autoZoom'
                    },
                    align: {
                        grid: true
                    }
                });
                editor.add(page)
                this.page = page;
                this.editor = editor;
            },
            draw() {
                this.page.read(this.flowData)
            }
        },
        async mounted() {
            await this.init();
            this.draw();
        },
        beforeDestroy() {
            this.editor.destroy();
        },
        watch: {
            flowData() {
                this.draw();
            }
        }
    };
</script>
<style lang="scss">
</style>
