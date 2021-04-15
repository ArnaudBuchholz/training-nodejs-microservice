const assert = require('assert')
const axios = require('axios')
const runner = require('../../runner')

describe('test service', () => {
  let testService
  let testServiceUrl

  before(async () => {
    testService = await runner.start('test')
    testServiceUrl = `http://localhost:${testService.port}`
  })

  it('starts with a random port', () => {
    assert.notStrictEqual(testService.port, 0)
  })

  it('answers requests on /test', async () => {
    const response = await axios.get(`${testServiceUrl}/test`)
    assert.strictEqual(response.status, 200)
    assert.notStrictEqual(response.headers['x-service-version'], undefined)
    assert.notStrictEqual(response.headers['x-service-timestamp'], undefined)
    assert.strictEqual(response.headers['x-echo'], undefined)
  })

  after(async () => {
    runner.stop()
  })
})
