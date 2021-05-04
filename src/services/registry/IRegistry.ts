import { IService } from './IService'
import { IRegisteredService } from './IRegisteredService'

export interface IRegistry {
  getServices () : Array<IRegisteredService>,
  get (name: string) : IRegisteredService | null,
  register (service: IService) : IRegisteredService,
  heartbeat (serviceId: string) : boolean,
  unregister (serviceId: string) : boolean
}