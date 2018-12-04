<template>
    <div ref="display" class="asd" />
</template>

<script>
    export default {
        props: {
            flowData: {
                type: Object
            },
            flow: {
                type: Function
            }
        },
        mounted() {
            const page = new this.flow({
                graph: {
                    container: this.$refs.display,
                    mode: 'read'
                },
                align: {
                    grid: true
                }
            });
            page.read(this.flowData);
            page.autoZoom()
        },
        methods: {
        }
    };
</script>
<style lang="scss">
</style>
