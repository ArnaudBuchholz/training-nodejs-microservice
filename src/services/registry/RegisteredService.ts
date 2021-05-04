import { IRegisteredService } from './IRegisteredService'
import { Service } from './Service'
import { v4 as uuid } from 'uuid'

export class RegisteredService extends Service implements IRegisteredService {
  id = ''
  registered: Date | null
  lastAccess: Date | null = null
  heartbeat: Date | null = null

  constructor (service: Service) {
    super(service)
    this.id = uuid()
    this.registered = new Date()
  }
}