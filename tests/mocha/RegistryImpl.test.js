const assert = require('assert')
const mockRequire = require('mock-require')
mockRequire('uuid', {
  v4: function () {
    return 'ARNAUD WAS HERE !'
  }
})

const RegistryImpl = require('../../src/services/RegistryImpl')

describe('RegistryImpl', () => {
  let out

  before(() => {
    out = new RegistryImpl()
  })

  it('is a class', () => {
    assert.strictEqual(typeof RegistryImpl, 'function')
  })

  it('exposes a method named getList', () => {
    assert.strictEqual(typeof out.getList, 'function')
  })

  it('gets the list of services', () => {
    assert.strictEqual(out.getList().length, 0)
  })

  describe('registering 1 service', () => {
    before(() => {
      out.register('test', '127.0.0.1', 8080)
    })

    function isTestService (service) {
      assert.strictEqual(service.name, 'test')
      assert.strictEqual(service.host, '127.0.0.1')
      assert.strictEqual(service.id, 'ARNAUD WAS HERE !')
    }

    it('returns 1 service', () => {
      const services = out.getList()
      assert.strictEqual(services.length, 1)
      const registeredService = services[0]
      isTestService(registeredService)
    })

    it('allows querying this service', () => {
      const service = out.getServiceByName('test')
      isTestService(service)
    })
  })
})
