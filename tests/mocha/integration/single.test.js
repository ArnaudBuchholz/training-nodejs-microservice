const assert = require('assert')
const axios = require('axios')
const runner = require('../../runner')

describe('api -> registry -> test', () => {
  before(async () => {
    await runner.start('api', {
      SERVICE_PORT: 8080,
      SERVICE_REGISTRY_LIST: 'localhost:8081'
    })
    await runner.start('registry', {
      SERVICE_PORT: 8081
    })
    await runner.start('test', {
      SERVICE_REGISTRY_LIST: 'localhost:8081'
    })
  })

  it('answers requests on /api/test', async () => {
    const value = new Date().toISOString()
    const response = await axios.get('http://localhost:8080/api/test', {
      headers: {
        'x-echo': value
      }
    })
    assert.strictEqual(response.status, 200)
    assert.notStrictEqual(response.headers['x-service-version'], undefined)
    assert.notStrictEqual(response.headers['x-service-timestamp'], undefined)
    assert.strictEqual(response.headers['x-echo'], value)
  })

  after(async () => {
    runner.stop()
  })
})
