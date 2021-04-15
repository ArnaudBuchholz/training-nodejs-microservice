module.exports = async configure => {
  const express = require('express')
  const morgan = require('morgan')

  const app = express()

  app.use(morgan('tiny'))

  const { name, port } = (await configure(app) || {})

  const server = app.listen(port || 0, () => {
    const allocatedPort = server.address().port
    if (name) {
      const registry = require('./registry')
      console.log(`Service ${name} listening on port ${allocatedPort}`)
      registry.register(name, allocatedPort)
    }
  })
}
