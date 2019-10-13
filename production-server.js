const express = require('express')
const open = require('open')
const port = 3000
let app = express()
app.use(express.static('dist'))
console.log(`Running on port ${port}`)
app.listen(port)
open(`http://localhost:${port}`)
