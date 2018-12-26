<template>
    <div class="run-msg">
        <div class="title" v-if='taskId'>
            taskId: {{taskId}}
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            };
        },
        props: ['runDesign', 'taskId'],
        methods: {

        },
        watch: {
            taskId(id) {
                window.ws.off('msg').emit('chat', id).on('msg', m => {
                    console.log(m)
                })
            }
        }
    };
</script>
<style lang="scss">
    .run-msg {
        color: #eee;
    }
</style>
