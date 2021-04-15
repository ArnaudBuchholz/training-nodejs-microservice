const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

const port = process.env.API_GATEWAY_PORT || 8080
app.listen(port, () => {
  console.log(`API gateway listening on port ${port}`)
})
