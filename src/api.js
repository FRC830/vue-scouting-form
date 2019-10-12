/* Api for managing all requests through the /api/ parameter */
var express = require('express')
var router = express.Router()
var axios = require('axios')
const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')
router.get('/', (req, res) => {
    res.send('Success!')
})
      // hopefully no one malicious abuses this system
router.get('/get/:file', (req, res) => {
    let loc = path.join('data', req.params.file)
    let fileType = req.params.file.split('.')[1]
    if (fileType === 'csv') {
        var results = []
        fs.createReadStream(loc)
        .pipe(csv.parse({ headers: true }))
        .on('data', data => results.push(data))
        .on('end', () => res.send(results))
    } else {
        fs.readFile(loc, (err, rawData) => {
            if (err) {
                res.send(err)
                return
            }
            if (fileType === 'json') {
                res.send(rawData)
            }
        })
    }
})
router.get('/save/:file', (req, res) => {
    console.log('Got', req.query)
    let fileType = req.params.file.split('.')[1]
    let loc = path.join('data', req.params.file)

    if (fileType === 'json') {
        fs.writeFile(loc, JSON.stringify(req.query), (err) => {
            if (err) { throw err }
            res.send('OK')
        })
    } else if (fileType === 'csv') {
        let exists = fs.existsSync(loc)

        let ws = fs.createWriteStream(loc, { flags: 'a' })
        ws.on('close', () => res.send('ok'))
        ws.write((exists) ? '\n' : '')

        csv.write([req.query], { headers: !exists })
        .pipe(ws)
        .on('error', (e) => { throw e })
    }
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
