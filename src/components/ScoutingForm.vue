<template>
  <form id="scouting" @submit="formSubmit">
    <p>Hello</p>
    <div class="form-group">
      <input type="text" name="text" placeholder="name!" />
    </div>
    <button class="btn btn-primary" type="submit" value="Submit">Submit</button>
  </form>
</template>
<script>
import JQuery from 'jquery'
let $ = JQuery
export default {
  name: 'ScoutingForm',
  methods: {
    formSubmit: function (e) {
      let data = $('#scouting').serialize()
      this.axios.get('/api/save?' + data)
      e.preventDefault()
    }
  }
}
</script>
