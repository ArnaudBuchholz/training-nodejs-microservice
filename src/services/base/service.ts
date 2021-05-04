import { Application, Request, Response } from 'express'
import { AddressInfo } from 'net'
import express = require('express')
const mappings = Symbol('service:mappings')

declare namespace Express {
    interface Request {
       impl?: any
    }
 }

function addMapping (target: any, mapper: Function) {
  if (!target[mappings]) {
    target[mappings] = []
  }
  target[mappings].push(mapper)
}

export function get (url: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('@get', url, propertyKey)
    // addMapping(target, (app: Application) => {
    //   app.get(url, (req: Request, res: Response) => {
    //   })
    // })
  }
}

export function post (url: string, BodyType: Function | undefined = undefined) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('@post', url, propertyKey)
  }
}

export function del (url: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('@del', url, propertyKey)
  }
}

type Service = {
  name?: string,
  port?: number
}

export interface IMicroService {
    new (): any
}


export function service (options: Service = {}) {
  return function (constructor: IMicroService) {
    // const morgan = require('morgan')

    // const app = express()
    // const impl = new constructor()

    // app.use(morgan('tiny'))
    // app.all('*', (req: Request, res: Response) => {
    //   req.impl = impl
    // })

    // constructor.prototype[mappings].forEach((mapper: Function) => mapper(app))

    // const server = app.listen(options.port || process.env.SERVICE_PORT || 0, () => {
    //   const { port: allocatedPort } = server.address() as AddressInfo
    //   console.log(`Listening on port ${allocatedPort}`)
    // //   if (options.name) {
    // //     require('./registry').register(name, allocatedPort)
    // //   }
    //   if (process.send) {
    //     process.send('ready')
    //   }
    // })    
  }
}