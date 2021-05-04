import { IService } from './IService'

export class Service implements IService {
  name = ''
  host = 'localhost'
  port = 0

  constructor (service: Service) {
    this.name = service.name
    this.host = service.host
    this.port = service.port
  }
}