<template>
<div id="tools">
<ErrorMessage v-for="message in messages" :message="message.value" :kind="message.kind" v-bind:key="message"></ErrorMessage>
<ConfigForm @message="displayMessage(...arguments)"></ConfigForm>
<ImportExport @message="displayMessage(...arguments)"></ImportExport>
</div>
</template>
<script>
import ConfigForm from '@/components/ConfigForm.vue'
import ImportExport from '@/components/ImportExport.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
export default {
    components: {
        ConfigForm,
        ImportExport,
        ErrorMessage
    },
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
