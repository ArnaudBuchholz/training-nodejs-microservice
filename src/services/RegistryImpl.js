const { v4: uuid } = require('uuid')

class RegistryService {
  constructor () {
    this._services = []
  }

  getList () {
    return this._services
  }

  register (name, host, port) {
    const service = {
      name,
      host,
      port,
      registered: Date.now(),
      id: uuid()
    }
    this._services.push(service)
    return service.id
  }
}

module.exports = RegistryService
