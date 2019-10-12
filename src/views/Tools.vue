<template>
<div id="tools">
  <form id="config" @submit="configSubmit">
    <h1> Edit Config </h1>
    <div class="form-group">
      <input class="form-check-input" type="radio" name="configType" value="find" id='1' v-model="select" selected>
      <label class="form-check-label" for="1">Match ID</label>
    </div>
    <div class="form-group">
      <input class="form-check-input" type="radio" name="configType" value="file" id='2' v-model="select">
      <label class="form-check-label" for="2">Select File</label>
    </div>
    <div class="form-group">
    <input v-if="select == 'find'" type="text" name='match' placeholder="Match ID">
    <input v-if="select == 'file'" type="file" name="file">
    </div>

    <div class="form-group">
      <select name="station" class="form-control" required>
        <option disabled selected>-- Select Station --</option>
        <option v-for="option in options" :value="cleanOption(option)" v-bind:key="option"> {{ option }} </option>
        </select>
    </div>
    <button class="btn btn-primary" type="submit">Save</button>
  </form>

</div>
</template>
<script>
export default {
    name: 'Tools',
    data: function () {
        return {
            select: '',
            options: ['Red 1', 'Red 2', 'Red 3', 'Blue 1', 'Blue 2', 'Blue 3']
        }
    },
    methods: {
        configSubmit: function (e) {
            var x = $('#config').serialize()
            console.log(x)
            e.preventDefault()
        },
        cleanOption: function(o) {
          return o.toLowerCase().replace(' ','-',-1)
      }
    }
}
</script>
