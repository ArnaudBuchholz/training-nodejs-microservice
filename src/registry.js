const axios = require('axios')
const localhost = '127.0.0.1'
const currentHost = process.env.CURRENT_HOST || localhost
const serviceRegistryUrls = (process.env.SERVICE_REGISTRY_LIST || 'localhost:8081')
  .split(';')
  .map(value => value.trim())
  .filter(value => !!value)

console.log('Service registry URLs : ', serviceRegistryUrls)

let serviceId
let intervalId
let hookProcessEnd = true

async function queryRegistry (method, endpoint, data) {
  for await (const serviceRegistryUrl of serviceRegistryUrls) {
    try {
      return await axios({
        method,
        url: `http://${serviceRegistryUrl}/${endpoint}`,
        data,
        validateStatus: status => (status >= 200 && status < 300) || status === 404
      })
    } catch (reason) {
      console.error(`${method.toUpperCase()} /${endpoint} on registry ${serviceRegistryUrl} failed`, reason.toString())
    }
  }
  throw new Error('No registry service available')
}

module.exports = {
  /**
   * Retrieves location of a service from its name
   * @param {string} name Name of the service to retreive
   * @return {object} Location of the service (host and port)
   */
  async getLocationOf (name) {
    const response = await queryRegistry('get', name)
    if (response.status === 404) {
      throw new Error(`Service ${name} not registered`)
    }
    return response.data
  },

  /**
   * Registers the current service, implement heartbeat and graceful stop
   * @param {string} name Name of the service
   * @param {number} port Port of the service
   * @param {string} host Host of the service
   * @return {Promise<string>} service ID
   */
  async register (name, port, host = currentHost) {
    try {
      const response = await queryRegistry('post', 'register', { name, port, host })
      const { id, heartbeat } = response.data
      serviceId = id
      intervalId = setInterval(() => {
        queryRegistry('post', serviceId)
          .catch(reason => {
            if (reason.response && reason.response.status === 404) {
              console.error('Registration lost, registering again...')
              clearInterval(intervalId)
              serviceId = undefined
              this.register(name, port, host)
            } else {
              console.error(`Unable to send a heartbeat to registry : ${reason}`)
            }
          })
      }, heartbeat)
      if (hookProcessEnd) {
        hookProcessEnd = false
        const processEnd = async () => {
          await this.unregister()
          process.exit(0)
        }
        process.on('SIGINT', processEnd)
        process.on('message', msg => {
          if (msg === 'shutdown') {
            processEnd()
          }
        })
      }
      console.log(`${name} registered with ID : ${serviceId}`)
    } catch (reason) {
      console.error(`Unable to register ${name}, retrying in 1s...`, reason.toString())
      setTimeout(() => this.register(name, port, host), 1000)
    }
  },

  /** Unregister the current service */
  async unregister () {
    if (serviceId) {
      clearInterval(intervalId)
      queryRegistry('delete', serviceId)
        .then(() => console.log(`Unregistered service ${serviceId}`))
        .catch(reason => console.error(`Unable to unregister service from registry : ${reason}`))
      serviceId = undefined
    }
  }
}
