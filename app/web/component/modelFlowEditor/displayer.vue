<template>
    <div class="g6-displayer" />
</template>

<script>
    export default {
        data() {
            return {
                width: 0,
                height: 0
            }
        },
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
                        container: this.$el,
                        mode: 'read',
                        fitView: 'autoZoom',
                        width: this.width,
                        height: this.height
                    },
                    align: {
                        grid: true
                    }
                });
                editor.add(page)
                this.page = page;

                this.$once('hook:beforeDestroy', () => {
                    editor.destroy();
                })
            },
            draw() {
                this.page.read(this.flowData)
            }
        },
        async mounted() {
            this.width = this.$el.clientWidth;
            this.height = this.$el.clientHeight;
            await this.init();
            this.draw();
        },
        watch: {
            flowData() {
                this.draw();
            }
        }
    };
</script>
<style lang="scss">
    .g6-displayer {
        > div {
            pointer-events: none;
        }
    }
</style>
