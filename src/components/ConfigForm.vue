<template>
  <div class="container mb-3">
      <div class="card">
        <div class="card-header">Edit Config</div>
        <div class="card-body">
          <form id="config" @submit.prevent="configSubmit">
            <div class="form-check text-left">
              <input class="form-check-input" type="radio" name="configType" value="input" id="1" v-model="select">
              <label class="form-check-label" for="1">Select by Event ID</label>
            </div>
            <div class="form-check text-left mb-4">
              <input class="form-check-input" type="radio" name="configType" value="upload" id="2" v-model="select">
              <label class="form-check-label" for="2">Upload Event Schedule</label>
            </div>
            <div class="form-group row">
              <div class="input-group col">
                <div class="input-group-prepend">
                  <label class="input-group-text"> {{ select == 'upload' ? 'Choose File' : 'Event ID'}} </label>
                </div>
                <div class="custom-file" v-if="select == 'upload'">
                  <input class="custom-file-input"  ref="file" type="file" accept=".json" name="file" @change="fileSubmit">
                  <label class="custom-file-label"> Upload Schedule </label>
                </div>
                <input v-else class="form-control"  ref="match" type="text" name="match" placeholder="ex. 2019lincoln">
              </div>
            </div>
            <div class="form-group row">

              <div class="input-group col">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="station">Select Station</label>
                  </div>

                  <select name="station" id="station" class="custom-select" v-model="station" required>
                      <option v-for="option in options" :value="option" v-bind:key="option">{{ option }}</option>
                  </select>
              </div>
                  <button class="btn col-2 btn-primary" type="submit">Save</button>
            </div>
                  <!-- <div class="col"> -->

                  <!-- </div> -->
          </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ConfigForm',
  data () {
    return {
      file: '',
      select: '',
      station: '',
      options: ['Red 1', 'Red 2', 'Red 3', 'Blue 1', 'Blue 2', 'Blue 3']
    }
  },
  methods: {
    fileSubmit () {
      this.file = this.$refs.file.files[0]
    },
    async configSubmit () {
      let vals = this.station.split(' ')
      let station = vals[0].toLowerCase()
      let stationNum = vals[1]
      let result = this[this.select + 'Schedule']()
      let fileName =
        this.select === 'upload'
          ? this.file.name
          : this.$refs.match.value + '.json'

      result
        .then(res => {
          this.$emit('message', 'success', res.data.success)
          this.saveConfig({
            schedule: fileName,
            matchNum: 0,
            station: station,
            stationNum: stationNum
          })
        })
        .catch(err => {
          console.log(err.response.data.error)
          this.$emit('message', 'error', err.response.data.error)
        })
    },
    async uploadSchedule () {
      const formData = new FormData()
      formData.append('file', this.file)
      return this.axios.post('/api/upload-schedule', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    async downloadSchedule () {
      return this.axios.post(
        `/api/download-schedule/${this.$refs.match.value}`
      )
    },
    async saveConfig (config) {
      console.log('Config is:', config)
      this.axios
        .post('/api/file/config.json', config)
        .then(res => {
          this.$emit('message', 'success', res.data.success)
        })
        .catch(err => {
          this.$emit('message', 'error', err.response.data.error)
        })
    }
  }
}
</script>
