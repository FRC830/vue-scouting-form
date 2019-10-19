<template>
<div v-if="message" :class="[this.kind == 'error' ? 'alert-danger' : 'alert-success']" class="alert alert-error alert-dismissible fade show" role="alert">
    {{ message }}
    <button type="button" class="close" data-dismiss="alert">
        <span>&times;</span>
    </button>
</div>

</template>
<script>
export default {
    name: 'ErrorMessage',
    props: ['message', 'kind'],
    data () {
        return {
            msShow: 1000,
            msFade: 300
        }
    },
    mounted () {
        $('.alert-success').fadeTo(this.msShow, this.msFade).slideUp(this.msFade, () => {
            $('.alert-success').alert('close')
        })
    }
}

</script>
