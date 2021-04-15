module.exports = async configure => {
  const express = require('express')
  const morgan = require('morgan')

  const app = express()

  app.use(morgan('tiny'))

  const { name, port } = (await configure(app, express) || {})

  const server = app.listen(port || process.env.SERVICE_PORT || 0, () => {
    const allocatedPort = server.address().port
    console.log(`Listening on port ${allocatedPort}`)
    if (name) {
      require('./registry').register(name, allocatedPort)
    }
    if (process.send) {
      process.send('ready')
    }
  })
}
