<template>
<div id="tools">
  <form id="config" @submit="formSubmit">
    <p>Select your station</p>
    <div class="form-group">
      <select class="form-control">
        <option v-for="option in options" v-bind:key=option> {{ option }} </option>
        </select>
    </div>
    <button class="btn btn-primary" type="submit" value="Submit">Save config</button>
  </form>

</div>
</template>
<script>
export default {
    name: 'Tools',
    data: function () {
        return {
            options: ['Red 1', 'Red 2', 'Red 3', 'Blue 1', 'Blue 2', 'Blue 3']
        }
    },
    methods: {
        configSubmit (e) {
            this.$('config').serialize()
            e.preventDefault()
        }
    }
}
</script>