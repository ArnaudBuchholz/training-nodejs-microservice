import { join } from 'path'
import { $options, $mappings, Mapping } from './@service'
import { body, check, log, serve } from 'reserve'
import { IncomingMessage, ServerResponse } from "node:http"

const serviceModule = join(process.cwd(), process.argv[2])

const sendJSON = (res: ServerResponse, obj: object) => {
  const jsonString: string = JSON.stringify(obj)
  res.writeHead(200, {
    'content-type': 'application/json',
    'content-length': jsonString.length
  })
  res.end(jsonString)
}

const mappers = {
  GET: (serviceImpl: any, mapping: Mapping) => {
    return {
      method: 'GET',
      match: mapping.url,
      custom: async (req: IncomingMessage, res: ServerResponse, ...args: Array<string>) => {
        const result: any = await serviceImpl[mapping.propertyKey].call(serviceImpl, ...args)
        if (null === result) {
          return 404
        }
        sendJSON(res, result)
      }
    }
  },

  POST: (serviceImpl: any, mapping: Mapping) => {
    return {
      method: 'POST',
      match: mapping.url,
      custom: async (req: IncomingMessage, res: ServerResponse, ...args: Array<string>) => {
        let argBody: object | undefined = undefined
        if (mapping.BodyType) {
          const reqBody = JSON.parse(await body(req))
console.log('>>', reqBody)
          argBody = new mapping.BodyType(reqBody)
console.log('<<', argBody)
        }
        const result: any = await serviceImpl[mapping.propertyKey].call(serviceImpl, ...args, argBody)
        if (!result) {
          return 204
        }
        sendJSON(res, result)
      }
    }
  },

  DELETE: (serviceImpl: any, mapping: Mapping) => {
    return {
      method: 'GET',
      match: mapping.url,
      custom: async (req: IncomingMessage, res: ServerResponse, ...args: Array<string>) => {
        if (await serviceImpl[mapping.propertyKey].call(serviceImpl, ...args)) {
          return 204
        }
        return 404
      }
    }
  }
}

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
      configuration.mappings.push(mappers[mapping.method](serviceImpl, mapping))
    })
    return check(configuration)
  })
  .then((checkedConfiguration: any) => {
    const server = log(serve(checkedConfiguration))
    server.on('ready', (info: any) => {
      console.log(`Listening on port ${info.port}`)
    })
  })

