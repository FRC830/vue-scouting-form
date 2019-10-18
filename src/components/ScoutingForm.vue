<template>
  <div id="scouting-form">
    <div class="row">
      <div class="col mb-1">
          <button v-if="config.station" type="button" :class="[this.config.station == 'red' ? 'btn-danger' : 'btn-primary']" class="btn btn-primary mr-1"> Station
            <span class="badge badge-light"> {{ config.station.capitalize() + " " + config.stationNum }} </span>
          </button>
          <button v-if="config.schedule" type="button" class="btn btn-primary mr-1"> Event
            <span class="badge badge-light"> {{ config.schedule.split('.')[0] }} </span>
          </button>
          <button v-if="currentMatch" type="button" class="btn btn-primary mr-1"> Match
            <span class="badge badge-light"> {{ currentMatch.match }} </span>
          </button>
          <button v-if="currentMatch" type="button" class="btn btn-primary"> Team
            <span class="badge badge-light"> {{ currentMatch[config.station][config.stationNum - 1].replace('frc','') }} </span>
          </button>
      </div>
    </div>

  <div class="row">
    <div class="col">
    <form id="scouting" @submit.prevent="formSubmit">

      <div class="form-group">
        <input type="text" name="text" placeholder="Name" />
      </div>
      <div class="form-group">
        <input type="number" name="value" placeholder="Age" />
      </div>
      <button class="btn btn-primary" type="submit" value="Submit">Submit</button>
    </form>
    </div>
  </div>
  </div>
</template>
<script>
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
      schedule: {},
      currentMatch: {}
    }
  },
  mounted () {
    this.getConfigAndSchedule()
  },
  methods: {
    setCurrentMatch () {
      this.currentMatch = this.schedule[this.config.matchNum]
    },
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
        console.log('matchNum', this.config.matchNum)
        this.schedule = res.data
        this.setCurrentMatch()
        this.$emit('message', 'success', `Successfully retreived schedule ${this.config.schedule}.`)
      }).catch(err => {
        this.$emit('message', 'error', err.response.data.error)
      })
    },
    formSubmit (e) {
      let data = this.$('#scouting').serialize()
      this.save('scouting.csv', data)
      this.config.matchNum += 1
      this.setCurrentMatch()
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
