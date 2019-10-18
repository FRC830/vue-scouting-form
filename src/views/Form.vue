<template>
  <div class="about">
    <h5>This is the form submit page</h5>
    <ErrorMessage v-for="message in messages" :message="message.value" :kind="message.kind"></ErrorMessage>
    <ScoutingForm @message="displayMessage(...arguments)"></ScoutingForm>
  </div>
</template>
<script>
import ScoutingForm from '@/components/ScoutingForm.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {
  components: { ScoutingForm, ErrorMessage },
    data () {
      return {
          messages: []
      }
    },
    methods: {
        displayMessage (kind, value) {
            this.messages.push({ kind: kind, value: value })
        }
    }
}
</script>
