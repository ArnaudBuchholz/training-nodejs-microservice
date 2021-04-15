const express = require('express')
const morgan = require('morgan')
const axios = require('axios')
const registry = require('../registry')

const app = express()

app.use(morgan('tiny'))

function fwd (service, url) {
  return async function (req, res) {
    try {
      const { host, port } = await registry.getLocationOf(service)
      axios.get(`http://${host}:${port}/${url || req.url.substring(1)}`, {
        headers: req.headers,
        validateStatus: status => (status >= 200 && status < 300) || [301, 302, 303, 304, 401, 403, 404].includes(status)
      })
        .then(response => {
          res.status(response.status)
          res.set(response.headers)
          res.send(response.data)
        })
        .catch(err => {
          // TODO notify registry of failure
          console.error(err.toString())
          res.sendStatus(500)
        })
    } catch (err) {
      console.error(`Unable to fetch location of ${service}`, err.toString())
      res.sendStatus(500)
    }
  }
}

// /api/test --> test
app.get('/api/test', fwd('test', 'test'))

// default --> www
app.get(/.*/, fwd('www'))

const port = process.env.SERVICE_PORT || 8080
app.listen(port, () => {
  console.log(`API gateway listening on port ${port}`)
})
