<template>
  <div class="about">
    <h1>This is the form submit page</h1>
    <ScoutingForm saveURL='/api/save'></ScoutingForm>

  </div>
</template>
<script>
import ScoutingForm from '@/components/ScoutingForm.vue'
export default {
  components: { ScoutingForm }
}
</script>
