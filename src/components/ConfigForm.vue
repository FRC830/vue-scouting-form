<template>
  <form id="config" @submit.prevent="configSubmit">
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
    <input v-if="select == 'find'" ref='match' type="text" name='match' placeholder="Match ID">
    <input v-if="select == 'file'" ref='file' type="file" name="file" @change='handleFileSubmit()'>
    </div>

    <div class="form-group">
      <select name="station" class="form-control" ref='station' @change='handleStationSelect()' required>
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
            station: '',
            stationNum: '',
            select: '',
            options: ['Red 1', 'Red 2', 'Red 3', 'Blue 1', 'Blue 2', 'Blue 3']
        }
    },
    methods: {
        handleStationSelect () {
            console.log(this.$refs.station.value)
            let vals = this.$refs.station.value.split(' ')
            this.station = vals[0].toLowerCase()
            this.stationNum = vals[1]
        },
        handleFileSubmit () {
            // https://blog.bitsrc.io/uploading-files-and-images-with-vue-and-express-2018ca0eecd0
            this.file = this.$refs.file.files[0]
        },
        async configSubmit () {
            if (this.select === 'file') {
                await this.uploadSchedule()
                await this.saveConfig({
                'schedule': this.file.name,
                'matchNum': 0,
                'station': this.station,
                'stationNum': this.stationNum
                })
            } else {
                await this.downloadSchedule()
                await this.saveConfig({
                    'schedule': this.$refs.match.value + '.json',
                    'matchNum': 0,
                    'station': this.station,
                    'stationNum': this.stationNum
                    })
            }
        },
        async uploadSchedule () {
            const formData = new FormData()
            formData.append('file', this.file)
            this.axios.post('/api/upload-schedule', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .catch(err => {
                this.$emit('error', err.response.data)
            })
        },
        async downloadSchedule () {
            this.axios.post(`/api/download-schedule/${this.$refs.match.value}`).catch(err => {
                this.$emit('error', err.response.data)
            })
        },
        saveConfig: async function (config) {
            console.log('Config is:', config)
            this.axios.post('/api/save/config.json', config).catch(err => {
                this.$emit('error', err.response.data)
            })
        },
        cleanOption: function (str) {
          return str.toLowerCase().replace(' ', '-', -1)
      }
    }
}
</script>
