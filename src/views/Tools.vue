<template>
<div id="tools">
<ErrorMessage v-for="message in messages" :message="message.value" :kind="message.kind" v-bind:key="message"></ErrorMessage>
<ConfigForm @message="displayMessage(...arguments)"></ConfigForm>
</div>
</template>
<script>
import ConfigForm from '@/components/ConfigForm.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
export default {
    name: 'Tools',
    components: {
        ConfigForm,
        ErrorMessage
    },
    data () {
        return {
            messages: [],
            kind: ''
        }
    },
    methods: {
        displayMessage (kind, value) {
            this.messages.push({kind: kind, value: value})
        }
    }
}
</script>
