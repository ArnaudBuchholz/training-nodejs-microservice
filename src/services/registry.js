require('../service')(async (app, express) => {
  const { v4: uuid } = require('uuid')
  const int = value => parseInt(value || '0', 10)

  const settings = {
    heartbeat: int(process.env.HEARTBEAT_DELAY) || 5000
  }
  const services = []

  app.get('/', (req, res) => {
    res.send(services)
  })

  app.get('/:name', (req, res) => {
    const serviceName = req.params.name
    const candidates = services.filter(item => item.name === serviceName)
    candidates.sort((s1, s2) => (s1.lastUsed || 0) - (s2.lastUsed || 0))
    const service = candidates[0]
    if (service) {
      service.lastUsed = Date.now()
      return res.send(service)
    }
    res.sendStatus(404)
  })

  app.post('/register', express.json(), (req, res) => {
    const id = uuid()
    const registered = Date.now()
    services.push({ ...req.body, registered, id })
    res.send({ ...settings, id })
  })

  app.post('/:id', (req, res) => {
    const { id } = req.params
    const service = services.find(item => item.id === id)
    if (service) {
      service.lastHeartbeat = Date.now()
      return res.sendStatus(200)
    }
    res.sendStatus(404)
  })

  app.delete('/:id', (req, res) => {
    const { id } = req.params
    const index = services.findIndex(item => item.id === id)
    if (index !== undefined) {
      services.splice(index, 1)
      return res.sendStatus(204)
    }
    res.sendStatus(404)
  })

  return {
    port: 8081
  }
})
