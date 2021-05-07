declare module 'reserve';

declare namespace REserve {
  export interface Configuration {
    port: number,
    mappings: Array<any>
  }
}

declare namespace Express {
  interface Request {
      body?: object,
      params?: any
  }
}