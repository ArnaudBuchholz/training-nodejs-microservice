import { Service } from './Service'
import { RegisteredService } from './RegisteredService'
import { IRegistry } from './IRegistry'
import { service, get, post, del } from '../core/@service'

const idEndPoint = /\/(\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b)/

@service()
export class Registry implements IRegistry {
  private _services : Array<RegisteredService> = []

  @get('/$')
  getServices () {
    return this._services
  }

  @get(/\/(\w+)/)
  get (name: string) : RegisteredService | null {
    const registeredService = this._services.find(item => item.name === name)
    if (registeredService) {
      registeredService.lastAccess = new Date()
      return registeredService
    }
    return null
  }

  @post('/register', Service)
  register (service: Service) : RegisteredService {
    const registeredService = new RegisteredService(service)
    registeredService.registered = new Date()
    this._services.push(registeredService)
    return registeredService
  }

  @post(idEndPoint)
  heartbeat (serviceId: string) : boolean {
    const registeredService = this._services.find(service => service.id === serviceId.toLowerCase())
    if (registeredService) {
      registeredService.heartbeat = new Date()
      return true
    }
    return false
  }

  @del(idEndPoint)
  unregister (serviceId: string) : boolean {
    const index = this._services.findIndex(service => service.id === serviceId.toLowerCase())
    if (index !== undefined) {
      const registeredService = this._services[index]
      this._services.splice(index, 1)
      return true
    }
    return false
  }
}