const express = require('express')
const axios = require('axios')
const registry = require('../registry')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

// /api/test --> test service
app.get('/api/test', async function (req, res) {
  try {
    const { host, port } = await registry.getLocationOf('test')
    axios.get(`http://${host}:${port}/test`, {
      headers: req.headers
    })
      .then(response => {
        res.status(response.status)
        res.set(response.headers)
        res.send(response.data)
      })
      .catch(err => {
        console.error(err.toString())
        res.sendStatus(500)
      })
  } catch (err) {
    console.error(err.toString())
    res.sendStatus(500)
  }
})

const port = process.env.API_GATEWAY_PORT || 8080
app.listen(port, () => {
  console.log(`API gateway listening on port ${port}`)
})
