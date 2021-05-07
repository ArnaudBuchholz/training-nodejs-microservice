import express, { Request, Response } from 'express';
import { Registry } from './Registry'
import { Service } from './Service'


const app = express()
const registry = new Registry()

app.get('/', (req: Request, res: Response) => {
  const services = registry.getServices()
  res.send(services)
})

app.post('/register', express.json(), (req: Request, res: Response) => {
  const service = new Service(req.body)
  const registeredService = registry.register(service)
  res.send(registeredService)
})

app.get('/:name', (req: Request, res: Response) => {
  const registeredService = registry.get(req.params.name)
  if (registeredService) {
    return res.send(registeredService)
  }
  res.sendStatus(404)
})

app.post('/:id', (req: Request, res: Response) => {
  if (registry.heartbeat(req.params.id)) {
    return res.sendStatus(204)
  }
  res.sendStatus(404)
})

app.delete('/:id', (req: Request, res: Response) => {
  if (registry.unregister(req.params.id)) {
    return res.sendStatus(204)
  }
  res.sendStatus(404)
})
  
const port = process.env.SERVICE_REGISTRY_PORT || 8081
app.listen(port, () => {
  console.log(`Service registry listening on port ${port}`)
})
    