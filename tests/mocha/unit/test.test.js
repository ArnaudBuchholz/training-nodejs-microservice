const assert = require('assert')
const axios = require('axios')
const runner = require('../../runner')

describe('test service', () => {
  before(async () => {
    await runner.start('test', {
      SERVICE_PORT: 8089
    })
  })

  it('answers requests on /test', async () => {
    const response = await axios.get('http://localhost:8089/test')
    assert.strictEqual(response.status, 200)
    assert.notStrictEqual(response.headers['x-service-version'], undefined)
    assert.notStrictEqual(response.headers['x-service-timestamp'], undefined)
    assert.strictEqual(response.headers['x-echo'], undefined)
  })

  it('forwards x-echo', async () => {
    const value = new Date().toISOString()
    const response = await axios.get('http://localhost:8089/test', {
      headers: {
        'x-echo': value
      }
    })
    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.headers['x-echo'], value)
  })

  it('fails on unsupported endpoint', async () => {
    const response = await axios.get('http://localhost:8089/unknown', {
      validateStatus: () => true
    })
    assert.strictEqual(response.status, 404)
  })

  after(async () => {
    runner.stop()
  })
})
