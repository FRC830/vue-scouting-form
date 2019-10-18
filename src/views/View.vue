<template>
    <div id="data-viewer">
        <ErrorMessage v-for="message in messages" :message="message.value" :kind="message.kind"></ErrorMessage>
        <ScoutingTable @message="displayMessage(...arguments)"></ScoutingTable>
    </div>
</template>
<script>
    import ScoutingTable from '@/components/ScoutingTable.vue'
    import ErrorMessage from '@/components/ErrorMessage.vue'
    export default {
        components: {
            ScoutingTable, ErrorMessage
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
