import { isIService, IService } from './IService'

export class Service implements IService {
  name = ''
  host = 'localhost'
  port = 0

  constructor (service: any) {
    if (isIService(service)) {
      this.name = service.name
      this.host = service.host
      this.port = service.port
    } else {
      throw new Error('Unsupported parameter')
    }
  }
}