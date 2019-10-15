<template>
  <form id="scouting" @submit.prevent="formSubmit" ref="form">
    <p v-if="config.station" > {{ info }} </p>
    <div>
      <p v-if="schedule.match"> Scouting match #{{ schedule.match }} for team {{ schedule[config.station][config.stationNum - 1] }}. </p>
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
import serializeArray from '../serialize.js'
export default {
  name: 'ScoutingForm',
  data: function () {
    return {
      config: {},
      schedule: {}
    }
  },
  mounted () {
    this.getConfig()
  },
  computed: {
    info () {
      return `Currently scouting for ${this.config.station.capitalize()} ${this.config.stationNum} at event ${this.config.schedule.split('.')[0]}`
    }
  },
  methods: {
    getConfig () {
      this.axios.get('/api/get/config.json').then(res => {
        console.log('received', res.data)
        if (res.data.schedule) {
          this.getSchedule(res.data)
          this.config = res.data
        }
      }).catch(err => {
        throw err
      })
    },
    formSubmit: function (e) {
      let data = serializeArray(this.$refs.form)
      console.log(data)
      this.axios.post('/api/save/scouting.csv', data)
      this.config.matchNum += 1
      if (this.config.matchNum) {
        console.log(JSON.stringify(this.config), 'saving')
        this.axios.post('/api/save/config.json', this.config)
      }
    },

    getSchedule: function (data) {
      if (!data.schedule) {
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
