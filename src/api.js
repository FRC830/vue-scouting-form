/* Api for managing all requests through the /api/ parameter */
var express = require('express')
var axios = require('axios')
const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')
var formidable = require('formidable')
const TBA_AUTH = '29xEqqZ2h6p7rWSLyKgTPglPgIBl0SApb22HM3YZNmiasuRCaGfx9BCuIoL7ayjP'
var router = express.Router()

router.get('/', (req, res) => {
    res.status(200).send('API online')
})

router.post('/upload-schedule', (req, res, next) => {
    var form = formidable.IncomingForm()
    form.uploadDir = 'data'
    form.keepExtensions = true
    form.keepFilenames = true
    form.parse(req)
    form
    .on('file', (_, file) => {
        fs.rename(file.path, path.join(form.uploadDir, 'schedules', file.name), (err) => {
            if (err) { next(err) }
        })
    })
    .on('error', (err) => { next(err) })
    .on('end', () => { res.status(200) })
})

router.get('/get/:file', (req, res, next) => {
    let loc = path.join('data', req.params.file)
    let fileType = req.params.file.split('.')[1]
    if (fileType === 'csv') {
        var results = []
        fs.createReadStream(loc)
        .pipe(csv.parse({ headers: true }))
        .on('data', data => results.push(data))
        .on('end', () => res.status(200).json(results))
    } else {
        fs.readFile(loc, (err, rawData) => {
            if (err) {
                next(err)
            }
            if (fileType === 'json') {
                res.status(200).json(rawData)
            }
        })
    }
})
router.get('/save/:file', (req, res, next) => {
    console.log('Got', req.query)
    let fileType = req.params.file.split('.')[1]
    let loc = path.join('data', req.params.file)

    if (fileType === 'json') {
        fs.writeFile(loc, JSON.stringify(req.query), (err) => {
            if (err) { next(err) }
        })
        res.status(200).send()
    } else if (fileType === 'csv') {
        let exists = fs.existsSync(loc)

        let ws = fs.createWriteStream(loc, { flags: 'a' })
        ws.on('close', () => res.status(200))
        ws.write((exists) ? '\n' : '')

        csv.write([req.query], { headers: !exists })
        .pipe(ws)
        .on('error', (e) => { next(e) })
    }
})
router.post('/download-schedule/:event', (req, res, next) => {
    let url = `https://www.thebluealliance.com/api/v3/event/${req.params.event}/matches/simple`
    console.log(url)
    axios.get(url, { headers: { 'X-TBA-Auth-Key': TBA_AUTH } }).then(result => {
        let loc = path.join('data', 'schedules', req.params.event + '.json')
        let values = result.data
        .filter(val => { return val.comp_level === 'qm' })
        .map((val, index) => {
            return {
                'red': val.alliances.red.team_keys,
                'blue': val.alliances.blue.team_keys
            }
        })
        let stream = fs.createWriteStream(loc)
        stream.write(JSON.stringify(values, null, 2))
        stream.on('error', (err) => { next(err) })
        res.status(200).send()
    }).catch(err => { next(err) })
})
router.use((err, req, res, next) => {
    res.status(500).json({ error: err })
})
module.exports = router
