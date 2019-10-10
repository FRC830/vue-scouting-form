const api = require('./src/api')
module.exports = {
    devServer: {
        before: (app, server) => {
            app.use('/api', api)
        }
    }
}