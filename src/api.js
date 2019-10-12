/* Api for managing all requests through the /api/ parameter */
var express = require('express')
var router = express.Router()
const fs = require('fs')

const file = 'data/scouting.json'
router.get('/', (req, res) => {
    res.send('Success!')
})
router.get('/save', (req, res) => {
    console.log('Got', req.query)
    res.send('Yay')
    fs.readFile(file, (err, rawData) => {
        let data = err ? [] : JSON.parse(rawData)
        data.push(req.query)
        fs.writeFile(file, JSON.stringify(data), { flag: 'w' }, (err) => {
            if (err) { throw err }
        })
    })
})

module.exports = router
