module.exports = async configure => {
  const express = require('express')
  const morgan = require('morgan')

  const app = express()

  app.use(morgan('tiny'))

  const { name } = (await configure(app) || {})

  const server = app.listen(process.env.SERVICE_PORT || 0, () => {
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
