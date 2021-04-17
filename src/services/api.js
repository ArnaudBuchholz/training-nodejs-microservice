require('../service')(async app => {
  const http = require('http')
  const registry = require('../registry')
  const { v4: uuid } = require('uuid')

  function fwd (service, url) {
    return async function (req, res) {
      try {
        const { host, port } = await registry.getLocationOf(service)
        const requestId = uuid()
        const serviceRequest = http.request({
          port,
          host,
          method: req.method,
          path: url || req.url,
          headers: {
            ...req.headers,
            'x-request-id': requestId
          }
        })
        serviceRequest.on('response', serviceResponse => {
          const { statusCode, headers } = serviceResponse
          if ((statusCode >= 200 && statusCode < 300) || [301, 302, 303, 304, 401, 403, 404].includes(statusCode)) {
            res.writeHead(statusCode, {
              ...headers,
              'x-request-id': requestId
            })
            serviceResponse.pipe(res)
          } else {
            console.error(`Unexpected service status code : ${statusCode}`)
            res.sendStatus(500)
          }
        })
        serviceRequest.on('error', err => {
          console.error(`Unexpected error while forwarding to ${service}`, err.toString())
          res.sendStatus(500)
        })
        req.pipe(serviceRequest)
      } catch (reason) {
        console.error(`Unable to fetch location of ${service}`, reason.toString())
        res.sendStatus(500)
      }
    }
  }

  // /api/test --> test
  app.get('/api/test', fwd('test', '/test'))

  // default --> www
  app.get(/.*/, fwd('www'))

  return {
    port: 8080
  }
})
