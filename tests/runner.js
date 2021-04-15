const os = require('os')
const { fork } = require('child_process')
const { join } = require('path')
const { v4: uuid } = require('uuid')

const services = []

module.exports = {
  start (serviceName, environementVariables) {
    const id = uuid()
    const service = fork(join(__dirname, 'serviceWrapper.js'), [serviceName, id], {
      cwd: join(__dirname, '../'),
      end: environementVariables,
      stdio: ['ignore', 'ignore', 'ignore', 'ipc']
    })
    service.id = uuid()
    services.push(service)
    let started
    const onMessage = message => {
      if (message.ready === id) {
        service.port = message.port
        started(service)
        service.off('message', onMessage)
      }
    }
    service.on('message', onMessage)
    return new Promise(resolve => {
      started = resolve
    })
  },

  stop (selector) {
    if (selector === undefined) {
      return Promise.all(services.map(service => this.stop(service.id)))
    }
    const service = services.filter(item => item.id === selector)[0]
    if (service) {
      if (service.killed) {
        return
      }
      let stopped
      const stopping = new Promise(resolve => {
        stopped = resolve
      })
      service.on('close', () => {
        stopped()
      })
      service.kill(os.constants.signals.SIGINT)
      return stopping
    }
    return Promise.reject(new Error('Unknown service'))
  }
}
