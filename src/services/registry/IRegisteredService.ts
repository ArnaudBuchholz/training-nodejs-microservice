import { IService } from './IService'

export interface IRegisteredService extends IService {
  id: string,
  registered: Date | null,
  lastAccess: Date | null,
  heartbeat: Date | null
}
