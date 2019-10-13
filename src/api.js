/* Api for managing all requests through the /api/ parameter */
var express = require('express')
var axios = require('axios')
const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')
var formidable = require('formidable')
const auth = '29xEqqZ2h6p7rWSLyKgTPglPgIBl0SApb22HM3YZNmiasuRCaGfx9BCuIoL7ayjP'
var router = express.Router()
router.get('/', (req, res) => {
    res.send('Success!')
})

router.post('/upload-schedule', (req, res) => {
    var form = formidable.IncomingForm()
    form.uploadDir = 'data'
    form.keepExtensions = true
    form.keepFilenames = true
    form.parse(req)
    form
    .on('file', (_, file) => {
        fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
            if (err) throw err
        })
    })
    .on('error', (err) => { throw err })
    .on('end', () => { res.send('OK') })
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
                res
                .set('Content-Type', 'application/json')
                .send(rawData)
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
router.post('/download-schedule/:event', (req, res) => {
    let url = `https://www.thebluealliance.com/api/v3/event/${req.params.event}/matches/simple`
    console.log(url)
    axios.get(url, { headers: { 'X-TBA-Auth-Key': auth } }).then(result => {
        var final = {}
        let loc = path.join('data', req.params.event + '.json')
        result.data
        .filter(val => { return val.comp_level === 'qm' })
        .forEach((val, index) => {
            let data = { 'red': val.alliances.red.team_keys,
            'blue': val.alliances.blue.team_keys }
            console.log(val.match_number)
            final[val.match_number] = data
        })
        let stream = fs.createWriteStream(loc)
        stream.write(JSON.stringify(final, null, 2))
        stream.on('error', (err) => { throw err })
        res.send('ok')
    }).catch(err => { throw err })
})
module.exports = router
