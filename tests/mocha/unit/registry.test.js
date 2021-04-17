const assert = require('assert')
const axios = require('axios')
const runner = require('../../runner')

describe('registry service', () => {
  before(async () => {
    await runner.start('registry', {
      SERVICE_PORT: 8081,
      HEARTBEAT_DELAY: 1000
    })
  })

  async function noServiceRegistered () {
    const response = await axios.get('http://localhost:8081/')
    assert.strictEqual(response.status, 200)
    assert.strictEqual(typeof response.data, 'object')
    assert.ok(Array.isArray(response.data))
    assert.strictEqual(response.data.length, 0)
  }

  async function fetchUnknownService () {
    const response = await axios.get('http://localhost:8081/unknown', {
      validateStatus: () => true
    })
    assert.strictEqual(response.status, 404)
  }

  describe('no services registered', () => {
    it('gives an empty answer', () => noServiceRegistered())
    it('returns 404 on unknwon service', () => fetchUnknownService())
  })

  describe('registering a fake service', () => {
    let testInstanceId

    before(async () => {
      const response = await axios.post('http://localhost:8081/register', {
        data: { name: 'test', host: '192.168.0.1', port: 1234 }
      })
      assert.strictEqual(response.status, 200)
      assert.strictEqual(typeof response.data, 'object')
      assert.strictEqual(response.data.heartbeat, 1000)
      testInstanceId = response.id
    })

    it('returns the service info', async () => {
      const response = await axios.get('http://localhost:8081/test')
      assert.strictEqual(response.status, 200)
      assert.strictEqual(typeof response.data, 'object')
      assert.strictEqual(response.data.host, '192.16.0.1')
      assert.strictEqual(response.data.port, 1234)
    })

    it('returns 404 on unknwon service', () => fetchUnknownService())

    after(async () => {
      const response = await axios.delete(`http://localhost:8081/${testInstanceId}`)
      assert.strictEqual(response.status, 204)
      await noServiceRegistered()
    })
  })

  after(async () => {
    runner.stop()
  })
})
