<template>
<div id="tools">
<div v-if="error" class="alert alert-error alert-dismissible fade show" role="alert">
    {{ error }}
    <button type="button" class="close" data-dismiss="alert">
        <span>&times;</span>
    </button>
</div>
<ConfigForm @error="displayError"></ConfigForm>
</div>
</template>
<script>
import ConfigForm from '@/components/ConfigForm.vue'
export default {
    name: 'Tools',
    components: {
        ConfigForm
    },
    data: function () {
        return {
            error: ''
        }
    },
    methods: {
        displayError (value) {
            this.error = value.message
        }
    }
}
</script>
