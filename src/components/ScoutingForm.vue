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

class ValidationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValidationError'
  }
}

export default {
  name: 'ScoutingForm',
  data () {
    return {
      config: {},
      schedule: {}
    }
  },
  mounted () {
    this.getConfigAndSchedule()
  },
  computed: {
    info () {
      return `Currently scouting for ${this.config.station.capitalize()} ${this.config.stationNum} at event ${this.config.schedule.split('.')[0]}`
    }
  },
  methods: {
    async getConfigAndSchedule () {
      // Retrieve Config
      await this.axios.get('/api/get/config.json').then(res => {
        if (!res.data.schedule) {
          throw new ValidationError('Configuration File Corrupted. Try Saving Configuration Again.')
        }
        this.config = res.data
        this.$emit('message', 'success', `Successfully retrieved configuration file.`)
      }).catch(err => {
        console.log('Error:', err)
        if (err instanceof ValidationError) {
          this.$emit('message', 'error', err)
          return
        }
        this.$emit('message', 'error', err.response.data.error)
      })

      this.axios.get('/api/get/' + `schedules/${this.config.schedule}`.replace('/', '%2F')).then(res => {
        this.schedule = res.data[this.config.matchNum]
        this.$emit('message', 'success', `Successfully retreived schedule ${this.config.schedule}.`)
      }).catch(err => {
        this.$emit('message', 'error', err.response.data.error)
      })
    },
    formSubmit (e) {
      let data = serializeArray(this.$refs.form)
      this.save('scouting.csv', data)
      this.config.matchNum += 1
      this.save('config.json', this.config)
    },
    save (file, data) {
      this.axios.post(`/api/save/${file}`, data).then(res => {
        this.$emit('message', 'success', res.data.success)
      }).catch(err => {
        this.$emit('message', 'error', err.response.data.error)
      })
    }
  }
}
</script>
