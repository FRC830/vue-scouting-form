<template>
  <form id="scouting" @submit.prevent="formSubmit">
    <p> {{ info() }} </p>
    <div>
      <p> Scouting match #{{ schedule.match }} for team {{ schedule[config.station][config.stationNum - 1] }}. </p>
    </div>
    <div class="form-group">
      <input type="text" name="text" placeholder="Name" />
    </div>
    <div class="form-group">
      <input type="number" name="value" placeholder="Age" />
    </div>
    <button class="btn btn-primary" type="submit" value="Submit">Submit</button>
  </form>
</template>
<script>
import $ from 'jquery'

export default {
  name: 'ScoutingForm',
  data: function () {
    return {
      config: {},
      schedule: {}
    }
  },
  mounted () {
    this.axios.get('/api/get/config.json').then(res => {
      console.log('received', res.data)
      this.config = res.data
      this.fetchSchedule(res.data)
    }).catch(err => {
      throw err
    })
  },
  methods: {
    formSubmit: function (e) {
      let data = $('#scouting').serialize()
      console.log(data)
      this.axios.get('/api/save/scouting.csv?' + data)
      this.config.matchNum += 1
      if (this.config.matchNum ) {
        console.log(JSON.stringify(this.config), 'saving')
        this.axios.get('/api/save/config.json?', JSON.stringify(this.config))
      }
    },
    info () {
      return `Currently scouting for ${this.config.station.capitalize()} ${this.config.stationNum} at event ${this.config.schedule.split('.')[0]}`
    },
    fetchSchedule: function (data) {
      if (!data.matchNum) {
        console.log(data)
        throw Error('Reeeee')
      }
      this.axios.get('/api/get/' + `schedules/${data.schedule}`.replace('/', '%2F')).then(res => {
        this.schedule = res.data[data.matchNum]
      }).catch(err => {
        throw err
      })
    }
  }
}
</script>
