<template>
  <form id="config" @submit.prevent="configSubmit">
    <h1> Edit Config </h1>
    <div class="form-group">
      <input class="form-check-input" type="radio" name="configType" value="download" id='1' v-model="select" selected>
      <label class="form-check-label" for="1">Select by Event ID</label>
    </div>
    <div class="form-group">
      <input class="form-check-input" type="radio" name="configType" value="upload" id='2' v-model="select">
      <label class="form-check-label" for="2">Upload Event Schedule</label>
    </div>
    <div class="form-group">
    <input v-if="select == 'download'" ref='match' type="text" name='match' placeholder="Match ID">
    <input v-else ref='file' type="file" name="file" @change="fileSubmit">
    </div>

    <div class="form-group">
      <select name="station" class="form-control" v-model="station" required>
        <option disabled selected>-- Select Station --</option>
        <option v-for="option in options" :value="option" v-bind:key="option" > {{ option }} </option>
        </select>
    </div>
    <button class="btn btn-primary" type="submit">Save</button>
  </form>
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
            let fileName = (this.select === 'upload') ? this.file.name : this.$refs.match.value + '.json'

            result.then((res) => {
                this.$emit('message', 'success', res.data.success)
                this.saveConfig({
                'schedule': fileName,
                'matchNum': 0,
                'station': station,
                'stationNum': stationNum
            })
            }).catch(err => {
                console.log(err.response.data.error)
                this.$emit('message', 'error', err.response.data.error)
            })
        },
        async uploadSchedule () {
            const formData = new FormData()
            formData.append('file', this.file)
            return this.axios.post('/api/upload-schedule', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        },
        async downloadSchedule () {
            return this.axios.post(`/api/download-schedule/${this.$refs.match.value}`)
        },
        async saveConfig (config) {
            console.log('Config is:', config)
            this.axios.post('/api/save/config.json', config).then(res => {
                this.$emit('message', 'success', res.data.success)
            }).catch(err => {
                this.$emit('message', 'error', err.response.data.error)
            })
        }
    }
}
</script>
