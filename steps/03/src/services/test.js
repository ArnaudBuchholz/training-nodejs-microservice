const express = require('express')

const app = express()

app.disable('etag')

app.get('/test', (req, res) => {
  const echo = req.headers['x-echo']
  if (echo) {
    res.setHeader('x-echo', echo)
  }
  res.setHeader('x-service-version', 1)
  res.setHeader('x-service-timestamp', new Date().toISOString())
  res.send('TESTED')
})

const service = app.listen(0, () => {
  const port = service.address().port
  console.log(`Test service listening on port ${port}`)
})
