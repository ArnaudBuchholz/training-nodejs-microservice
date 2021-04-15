const os = require('os')
const { fork } = require('child_process')
const { join } = require('path')
const { v4: uuid } = require('uuid')

const services = []

module.exports = {
  start (serviceName, environementVariables) {
    const service = fork(join(__dirname, `../src/services/${serviceName}.js`), {
      cwd: join(__dirname, '../'),
      env: environementVariables,
      stdio: ['ignore', 'ignore', 'ignore', 'ipc']
    })
    service.id = uuid()
    service.name = serviceName
    services.push(service)
    let started
    const onMessage = message => {
      if (message === 'ready') {
        started(service)
        service.off('message', onMessage)
      }
    }
    service.on('message', onMessage)
    return new Promise(resolve => {
      started = resolve
    })
  },

  stop (service) {
    if (service === undefined) {
      return Promise.all(services
        .map(this.stop)
      )
    }
    if (typeof service === 'string') {
      return Promise.all(services
        .filter(item => item.id === service || item.name === service)
        .map(this.stop)
      )
    }
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
}
