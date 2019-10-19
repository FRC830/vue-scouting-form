<template>
    <div>
  <h1> Import Scouting Data </h1>
  <form @submit.prevent="mergeData">
    <input ref='file' type="file" name="file" accept=".csv" @change="fileSubmit"> 
    <button class="btn btn-primary" type="submit">Save</button>
  </form>
  <div class="row">
      <div class="col">
  <h2> Export Scouting Data </h2>
      </div>
  </div>
    <button @click="downloadData" class="btn btn-primary" type="submit">Export</button>
    </div>
</template>
<script>
var FileSaver = require('file-saver');
const csv = require('fast-csv')

export default {
    name: 'ImportExport',
    methods: {
        parseText(e) {
            let text = e.target.result
            let rows = []
            csv.parseString(text, { headers: false })
            .on('error', err => { this.$emit('message','error', err.message)})
            .on('data', row => { rows.push(row)})
            .on('end', () => { this.postRows(rows) })
        },
        postRows(rows) {
            this.axios.post('/api/file/scouting.csv', rows)
            .then(res => {
                this.$emit('message', 'success', res.data.error)
            }).catch(err => {
                this.$emit('message', 'error', err.response.data.error)
            })
        },
        async mergeData () {
            // (1) store text of uploaded file in memory, post to file
            // (2) upload file, read uploaded file, delete file, post to config
            // Option 1 is simpler, so lets do that.
            console.log('Merge Data request received.')
            const reader = new FileReader()
            reader.onload = this.parseText
            reader.readAsText(this.file)
        },
        downloadData () {
            this.axios.get('/api/file/scouting.csv/download').then(res => {
                console.log(res)
                FileSaver.saveAs(new Blob([res.data]), 'exported-scouting.csv')
            }).catch(err => {
                this.$emit('message', 'error', err.response.data.error)
            })
        },
        fileSubmit () {
            this.file = this.$refs.file.files[0]
        },
    },
    data() {
        return {
            file: '',
        }
    }
}
</script>