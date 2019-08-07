const connect = require('connect')
const serveStatic = require('serve-static')
const logger = console

const PORT = process.env.PORT || 3000

connect()
  .use(serveStatic(__dirname + '/dist'))
  .use(serveStatic(__dirname + '/assets'))
  .use(serveStatic(__dirname + '/manifest.xml'))
  .listen(PORT, () => logger.info(`Server running on ${PORT}...`))

