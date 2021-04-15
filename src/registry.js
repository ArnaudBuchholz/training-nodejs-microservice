const axios = require('axios')
const localhost = '127.0.0.1'
const currentHost = process.env.CURRENT_HOST || localhost
const serviceRegistryHost = process.env.SERVICE_REGISTRY_HOST || localhost
const serviceRegistryPort = process.env.SERVICE_REGISTRY_PORT || 8081
const serviceRegistryUrl = `http://${serviceRegistryHost}:${serviceRegistryPort}`

let serviceId
let intervalId

module.exports = {
  /**
   * Retrieves location of a service from its name
   * @param {string} name Name of the service to retreive
   * @return {object} Location of the service (host and port)
   */
  async getLocationOf (name) {
    const response = await axios.get(`${serviceRegistryUrl}/${name}`)
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
      const response = await axios.post(`${serviceRegistryUrl}/register`, { name, port, host })
      serviceId = response.data
      intervalId = setInterval(() => {
        axios.post(`${serviceRegistryUrl}/${serviceId}`)
          .catch(reason => console.error(`Unable to send a heartbeat to registry : ${reason}`))
      }, 5000)
      process.on('SIGINT', async () => {
        await this.unregister()
        process.exit(0)
      })
    } catch (reason) {
      console.error(`Unable to register ${name}`, reason.toString())
    }
  },

  /** Unregister the current service */
  async unregister () {
    if (serviceId) {
      clearInterval(intervalId)
      await axios.delete(`${serviceRegistryUrl}/${serviceId}`)
        .catch(reason => console.error(`Unable to unregister service from registry : ${reason}`))
      serviceId = undefined
    }
  }
}
