const connect = require('connect')
const serveStatic = require('serve-static')
const logger = console

const PORT = process.env.PORT || 3000

connect()
  .use(serveStatic(__dirname + '/dist'))
  .listen(PORT, () => logger.info(`Server running on ${PORT}...`))

