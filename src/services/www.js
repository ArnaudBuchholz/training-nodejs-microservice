const express = require('express')
const morgan = require('morgan')
const registry = require('../registry')
const { join } = require('path')

const app = express()

app.use(morgan('tiny'))

app.use(express.static(process.env.WWW_ROOT || join(__dirname, '../www')))

const server = app.listen(0, () => {
  const port = server.address().port
  console.log(`www service listening on port ${port}`)
  registry.register('www', port)
})
