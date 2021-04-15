require('../service')(async app => {
  app.disable('etag')

  const name = process.env.TESTED_BY_NAME || 'anonymous'

  app.get('/test', (req, res) => {
    const echo = req.headers['x-echo']
    if (echo) {
      res.setHeader('x-echo', echo)
    }
    res.setHeader('x-service-version', 1)
    res.setHeader('x-service-timestamp', new Date().toISOString())
    res.send(`Tested by ${name}`)
  })

  return {
    name: 'test'
  }
})
