const express = require('express')

const app = express()

const services = []
let id = 0

app.get('/', (req, res) => {
  res.send(services)
})

app.get('/:name', (req, res) => {
  const serviceName = req.params.name
  const service = services.find(item => item.name === serviceName)
  if (service) {
    return res.send(service)
  }
  res.sendStatus(404)
})

app.post('/register', express.json(), (req, res) => {
  const service = {
    ...req.body,
    registered: Date.now(),
    id: ++id
  }
  services.push(service)
  console.log('REGISTER  ', new Date(), service.id, service.name, service.host, service.port)
  res.send(service.id.toString())
})

app.post('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const service = services.find(item => item.id === id)
  if (service) {
    service.lastHeartbeat = Date.now()
    console.log('HEARTBEAT ', new Date(), service.id, service.name)
    return res.sendStatus(200)
  }
  res.sendStatus(404)
})

app.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const index = services.findIndex(item => item.id === id)
  if (index !== undefined) {
    const service = services[index]
    console.log('UNREGISTER', new Date(), service.id, service.name)
    services.splice(index, 1)
    return res.sendStatus(204)
  }
  res.sendStatus(404)
})

const port = process.env.SERVICE_REGISTRY_PORT || 8081
app.listen(port, () => {
  console.log(`Service registry listening on port ${port}`)
})
