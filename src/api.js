/* Api for managing all requests through the /api/ parameter */
var express = require('express')
var router = express.Router()
var axios = require('axios')
const fs = require('fs')

const file = 'data/scouting.json'
router.get('/', (req, res) => {
    res.send('Success!')
})
      // hopefully no one malicious abuses this system
router.get('/config', (req, res) => {
    
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
router.get('/schedule/:event', (req, res) => {
    let url = `https://www.thebluealliance.com/api/v2/event/${req.params.event}/matches`
    console.log(url)
    axios.get(url, { headers: { 'X-TBA-App-Id': 'frc830:vue-scouting:v1' } }).then(result => {
        var final = {}
        result.data
        .filter(val => { return val.comp_level === 'qm' })
        .forEach((val, index) => {
            let data = { 'red': val.alliances.red.teams,
            'blue': val.alliances.blue.teams }
            final[val.match_number] = data
        })
        res.send(final)
    }).catch(err => { res.send(err) })
})
module.exports = router
