import { Service } from './Service'
import { RegisteredService } from './RegisteredService'
import { IRegistry } from './IRegistry'
import { service, get, post, del } from '../base/service'

@service()
export class Registry implements IRegistry {
  #services : Array<RegisteredService> = []

  @get('/')
  getServices () {
    return this.#services
  }

  @get('/:name')
  get (name: string) : RegisteredService | null {
    const registeredService = this.#services.find(item => item.name === name)
    if (registeredService) {
      registeredService.lastAccess = new Date()
      return registeredService
    }
    return null
  }

  @post('/register')
  register (service: Service) : RegisteredService {
    const registeredService = new RegisteredService(service)
    registeredService.registered = new Date()
    this.#services.push(registeredService)
    return registeredService
  }

  @post('/:id')
  heartbeat (serviceId: string) : boolean {
    const registeredService = this.#services.find(service => service.id === serviceId)
    if (registeredService) {
      registeredService.heartbeat = new Date()
      return true
    }
    return false      
  }

  @del('/:id')
  unregister (serviceId: string) : boolean {
    const index = this.#services.findIndex(service => service.id === serviceId)
    if (index !== undefined) {
      const registeredService = this.#services[index]
      this.#services.splice(index, 1)
      return true
    }
    return false
  }
}