export const $mappings = Symbol('service:mappings')

export enum Method {
  GET,
  POST,
  DELETE
}

export type Mapping = {
  method: Method,
  url: string | RegExp,
  propertyKey: string
}

function addMapping (target: any, mapping: Mapping) {
  if (!target[$mappings]) {
    target[$mappings] = []
  }
  target[$mappings].push(mapping)
}

export function get (url: string | RegExp) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addMapping(target, { method: Method.GET, url, propertyKey })
  }
}

export function post (url: string | RegExp, BodyType: Function | undefined = undefined) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addMapping(target, { method: Method.POST, url, propertyKey })
  }
}

export function del (url: string | RegExp) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addMapping(target, { method: Method.DELETE, url, propertyKey })
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
