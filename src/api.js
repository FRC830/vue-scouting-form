var express = require('express')
var router = express.Router()
const fs = require('fs')

router.get('/', (req, res) => {
    res.send('Success!')
})
router.get('/save', (req, res) => {
    console.log('Got', req.query)
    res.send('Yay')
    fs.readFile('data.json', (err, data) => {
        if (err) { throw err }
        let newJSON = JSON.parse(data)
        newJSON.push(req.query)
        fs.writeFile('data.json', JSON.stringify(newJSON), err => { if (err) { throw err } })
    })
})

module.exports = router
