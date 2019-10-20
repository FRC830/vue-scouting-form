<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">Merge Scouting Data</div>
          <div class="card-body">
            <form @submit.prevent="mergeData">
              <input ref="file" type="file" name="file" accept=".csv" @change="fileSubmit" />
              <button class="btn btn-primary" type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="card-header">Export Scouting Data</div>
          <div class="card-body">
            <button @click="downloadData" class="btn btn-primary" type="submit">Download CSV</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
var FileSaver = require('file-saver')
const csv = require('fast-csv')
window.setImmediate = window.setTimeout

export default {
  name: 'ImportExport',
  methods: {
    parseText (e) {
      let text = e.target.result
      let rows = []
      csv
        .parseString(text, { headers: true, ignoreEmpty: true })
        .on('error', err => {
          this.$emit('message', 'error', err.message)
        })
        .on('data', row => {
          rows.push(row)
        })
        .on('end', () => {
          console.log('New Rows => ', rows)
          this.postRows(rows)
          rows = []
        })
    },
    postRows (rows) {
      this.axios
        .post('/api/file/scouting.csv', rows)
        .then(res => {
          this.$emit(
            'message',
            'success',
            'The files were successfully merged.'
          )
        })
        .catch(err => {
          this.$emit('message', 'error', err.response.data.error)
        })
    },
    async mergeData () {
      const reader = new FileReader()
      reader.onload = this.parseText
      reader.readAsText(this.file) // triggers onload function
    },
    downloadData () {
      this.axios
        .get('/api/file/scouting.csv/download')
        .then(res => {
          console.log(res)
          FileSaver.saveAs(new Blob([res.data]), 'exported-scouting.csv')
        })
        .catch(err => {
          this.$emit('message', 'error', err.response.data.error)
        })
    },
    fileSubmit () {
      this.file = this.$refs.file.files[0]
    }
  },
  data () {
    return {
      file: ''
    }
  }
}
</script>
