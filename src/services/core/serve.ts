import { join } from 'path'
import { $options, $mappings, Mapping, Method } from './@service'
import { check, log, serve } from 'reserve'
import { ClientRequest, ServerResponse } from "node:http"

const serviceModule = join(process.cwd(), process.argv[2])

import(serviceModule)
  .then(ServiceExports => {
    const [name] = Object.keys(ServiceExports)
    const ServiceConstructor = ServiceExports[name]
    const serviceImpl = new ServiceConstructor()
    const options = ServiceConstructor.prototype[$options]
    const configuration: REserve.Configuration = {
      port: options.port,
      mappings: []
    }
    ServiceConstructor.prototype[$mappings].forEach((mapping: Mapping) => {
      if (mapping.method === Method.GET) {
        const reserveMapping = {
          method: 'GET',
          match: mapping.url,
          custom: (req: ClientRequest, res: ServerResponse, ...args: Array<string>) => {
            console.log('GET', req.url, mapping.propertyKey)
            try {
              const result: any = serviceImpl[mapping.propertyKey].call(serviceImpl, ...args)
              if (null === result) {
                res.writeHead(404)
                res.end()
                return
              }
              const jsonString: string = JSON.stringify(result)
              res.writeHead(200, {
                'content-type': 'application/json',
                'content-length': jsonString.length
              })
              res.end(jsonString)
            } catch (e) {
              return 500
            }
          }
        }
        configuration.mappings.push(reserveMapping)
      }
    })
    return check(configuration)
  })
  .then((checkedConfiguration: any) => {
    const server = log(serve(checkedConfiguration))
    server.on('ready', (info: any) => {
      console.log(`Listening on port ${info.port}`)
    })
  })

