const express = require('express')
const fs = require('fs')
const logger = console

const PORT = process.env.PORT || 3000
const app = express()

const messagejs = fs.readFileSync(__dirname + '/src/helper/message.js').toString()
  .replace(/^var usageLogger = null;/, `var usageLogger='${process.env.LOGGER_URL}';`)

const manifestxml = fs.readFileSync(__dirname + '/manifest.xml').toString()
  .replace(new RegExp(process.env.PUBLIC_PLUGIN_URL, 'g'), process.env.INTERNAL_PLUGIN_URL)

if (process.env.DEBUG) {
  app.use((req, res, next) => {
    logger.info(req.method + ' ' + req.path)
    next()
  })
}

app.get('/', (req, res) => res.set('Content-Type', 'text/xml').send(manifestxml))
app.get('/src/helper/message.js', (req, res) => res.send(messagejs))
app.use('/src', express.static(__dirname + '/src'))
app.use('/assets', express.static(__dirname + '/assets'))

app.listen(PORT, () => logger.info(`Server running on ${PORT}...`))
