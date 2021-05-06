export const $mappings = Symbol('service:mappings')

export type Method = 'GET' | 'POST' | 'DELETE'

export type Mapping = {
  method: Method,
  url: string | RegExp,
  propertyKey: string,
  BodyType?: (new (body: any) => object) | undefined
}

function addMapping (target: any, mapping: Mapping) {
  if (!target[$mappings]) {
    target[$mappings] = []
  }
  target[$mappings].push(mapping)
}

export function get (url: string | RegExp) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addMapping(target, { method: 'GET', url, propertyKey })
  }
}

export function post (url: string | RegExp, BodyType: (new (body: any) => object) | undefined = undefined) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addMapping(target, { method: 'POST', url, propertyKey, BodyType })
  }
}

export function del (url: string | RegExp) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addMapping(target, { method: 'DELETE', url, propertyKey })
  }
}

export const $options = Symbol('service:options')

export type Service = {
  name?: string,
  port?: number
}

export interface IMicroService {
    new (): any
}

export function service (options: Service = {}) {
  return function (constructor: Function) {
    constructor.prototype[$options] = options
  }
}
