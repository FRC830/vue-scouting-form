<template>
  <form id="scouting" @submit.prevent="formSubmit">
    <p>This is an example scouting form!</p>
    <p> {{ info() }} </p>
    <div>
      <p> Scouting match #{{ schedule.match }} for team {{ schedule[config.station][config.stationNum] }}. </p>

    </div>
    <div class="form-group">
      <input type="text" name="text" placeholder="name!" />
    </div>
    <button class="btn btn-primary" type="submit" value="Submit">Submit</button>
  </form>
</template>
<script>
import $ from 'jquery'

export default {
  name: 'ScoutingForm',
  props: {
    saveURL: String
  },
  data: function () {
    return {
      config: {},
      schedule: {}
    }
  },
  mounted () {
    this.axios.get('/api/get/config.json').then(res => {
      this.config = res.data
      this.fetchSchedule()
    }).catch(err => {
      throw err
    })
  },
  methods: {
    formSubmit: function (e) {
      let data = $('#scouting').serialize()
      console.log(data)
      this.axios.get('/api/save/scouting.csv?' + data)
    },
    info() {
      return `Currently Scouting for ${this.config.station.capitalize()} ${this.config.stationNum } at event ${ this.config.schedule.split('.')[0] }`
    },
    fetchSchedule() {
      this.axios.get('/api/get/schedules%2F' + this.config.schedule).then(res => {
        this.schedule = res.data[this.config.matchNum]
      }).catch(err => {
        throw err
      })
    }
  }
}
</script>
