<template>
  <div style="font-size: 24px; text-align: center">
    <panel-group></panel-group>
    <imgStream></imgStream>
  </div>
</template>
<style>

</style>
<script type="text/babel">
  import PanelGroup from '../../component/panel.vue'
  import imgStream from 'component/imgStream'
  export default {
    components: {
      PanelGroup,
      imgStream
    },
  }
</script>
