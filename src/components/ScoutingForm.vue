<template>
  <form id="scouting" @submit.prevent="formSubmit">
    <p>This is an example scouting form!</p>
    <div class="form-group">
      <input type="text" name="text" placeholder="name!" />
    </div>
    <button class="btn btn-primary" type="submit" value="Submit">Submit</button>
  </form>
</template>
<script>
export default {
  name: 'ScoutingForm',
  props: {
    saveURL: String
  },
  methods: {
    formSubmit: function (e) {
      let data = this.$('#scouting').serialize()
      this.axios.get(this.saveURL + '?' + data)
    }
  }
}
</script>
