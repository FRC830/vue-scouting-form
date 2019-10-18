/* Api for managing all requests through the /api/ parameter */
const express = require('express')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')
var formidable = require('formidable')
const TBA_AUTH = '29xEqqZ2h6p7rWSLyKgTPglPgIBl0SApb22HM3YZNmiasuRCaGfx9BCuIoL7ayjP'
const router = express.Router()

router.use(express.json())

router.get('/', (req, res) => {
    res.status(200).json({ 'success': 'API online' })
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
    .on('end', () => { res.status(200).json({ 'success': `File ${req.file.name} was saved successfully` }) })
})

router.get('/get/:file', (req, res, next) => {
    let loc = path.join('data', req.params.file)
    let fileType = req.params.file.split('.')[1]
    if (fileType === 'csv') {
        var results = []
        fs.createReadStream(loc)
        .on('error', () => { next(Error(`The file ${req.params.file} could not be retrieved`)) })
        .pipe(csv.parse({ headers: true }))
        .on('data', data => results.push(data))
        .on('error', (err) => { next(err) })
        .on('end', () => res.status(200).json(results))
    } else {
        console.log('Location', loc)
        fs.readFile(loc, (err, rawData) => {
            if (err) {
                next(Error(`The file ${req.params.file} could not be retrieved`))
            }
            if (fileType === 'json') {
                res.status(200).json(JSON.parse(rawData))
            }
        })
    }
})
router.post('/save/:file', (req, res, next) => {
    console.log('Got', req.body, req.params.file)
    let fileType = req.params.file.split('.')[1]
    let loc = path.join('data', req.params.file)

    if (fileType === 'json') {
        fs.writeFile(loc, JSON.stringify(req.body, null, 2), (err) => {
            if (err) { next(err) }
        })
        res.status(200).json({ 'success': `File ${req.params.file} was saved successfully` })
    } else if (fileType === 'csv') {
        let exists = fs.existsSync(loc)

        let ws = fs.createWriteStream(loc, { flags: 'a' })
        ws.on('close', () => res.status(200).json({ 'success': `File ${req.params.file} was saved successfully` }))
        ws.write((exists) ? '\n' : '')

        csv.write([req.body], { headers: !exists })
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
                'blue': val.alliances.blue.team_keys,
                'match': parseInt(val.match_number)
            }
        })
        values.sort((a, b) => (a.match > b.match) ? 1 : -1)
        let stream = fs.createWriteStream(loc)
        stream.write(JSON.stringify(values, null, 2))
        stream.on('error', (err) => { next(err) })
        res.status(200).json({ 'success': `The schedule for event ${req.params.event} was saved.` })
    }).catch(() => {
        let error = new Error(`Could not find event ${req.params.event}. Make sure it includes the year and is spelled correctly!`)
        next(error)
    })
})
router.use((err, req, res, next) => {
    res.status(500).json({ 'error': err.message })
})
module.exports = router
