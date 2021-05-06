export interface IService {
  name: string,
  host: string,
  port: number
}

export function isIService (arg: any) : arg is IService {
  const key = Object.keys(arg)
  if (key.length !== 3) {
    return false
  }
  const { name, host, port } = arg
  if (typeof name !== 'string' || !name) {
    return false
  }
  if (typeof host !== 'string' || !host) {
    return false
  }
  if (typeof port !== 'number' || !port) {
    return false
  }
  return true
}