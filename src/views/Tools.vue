<template>
<div id="tools">
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
      <select name="station" class="form-control" v-model='station' required>
        <option disabled selected>-- Select Station --</option>
        <option v-for="option in options" :value="cleanOption(option)" v-bind:key="option"> {{ option }} </option>
        </select>
    </div>
    <button class="btn btn-primary" type="submit">Save</button>
  </form>
  <div class="message"> {{message}} </div>

</div>
</template>
<script>
export default {
    name: 'Tools',
    data: function () {
        return {
            select: '',
            file: '',
            message: '',
            station: '',
            options: ['Red 1', 'Red 2', 'Red 3', 'Blue 1', 'Blue 2', 'Blue 3']
        }
    },
    methods: {
        handleFileSubmit () {
            // https://blog.bitsrc.io/uploading-files-and-images-with-vue-and-express-2018ca0eecd0
            this.file = this.$refs.file.files[0]
        },
        async configSubmit () {
            if (this.select === 'file') {
                await this.uploadSchedule()
                await this.saveConfig({ 'schedule': this.file.name, 'station': this.station })
            } else {
                await this.downloadSchedule()
                await this.saveConfig({ 'schedule': this.$refs.match.value + '.json', 'station': this.station })
            }
        },
        async uploadSchedule () {
            const formData = new FormData()
            formData.append('file', this.file)
            this.axios.post('/api/upload-schedule', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        },
        async downloadSchedule () {
            this.axios.post(`/api/download-schedule/${this.$refs.match.value}`)
        },
        saveConfig: async function (config) {
            console.log(config)
            this.axios.get('/api/save/config.json', { params: config })
        },
        cleanOption: function (str) {
          return str.toLowerCase().replace(' ', '-', -1)
      }
    }
}
</script>
