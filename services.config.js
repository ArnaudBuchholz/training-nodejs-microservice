const { join } = require('path')

const base = {
  watch: false,
  shutdown_with_message: true
}

module.exports = {
  apps: [{
    ...base,
    name: 'api',
    script: 'src/services/api.js',
    env: {
      SERVICE_REGISTRY_LIST: 'localhost:8081;localhost:8082',
      SERVICE_PORT: 8080
    }
  }, {
    ...base,
    name: 'registry',
    script: 'src/services/registry.js',
    env: {
      SERVICE_REGISTRY_LIST: 'localhost:8082',
      SERVICE_PORT: 8081
    }
  }, {
    ...base,
    name: 'registry',
    script: 'src/services/registry.js',
    env: {
      SERVICE_REGISTRY_LIST: 'localhost:8081',
      SERVICE_PORT: 8082
    }
  }, {
    ...base,
    name: 'www',
    script: 'src/services/test.js',
    env: {
      SERVICE_REGISTRY_LIST: 'localhost:8081;localhost:8082',
      WWW_ROOT: join(__dirname, 'src/www')
    }
  }, {
    ...base,
    name: 'www',
    script: 'src/services/test.js',
    env: {
      SERVICE_REGISTRY_LIST: 'localhost:8082;localhost:8081',
      WWW_ROOT: join(__dirname, 'src/www')
    }
  }, {
    ...base,
    name: 'test_A',
    script: 'src/services/test.js',
    env: {
      SERVICE_REGISTRY_LIST: 'localhost:8081;localhost:8082',
      TESTED_BY_NAME: 'A'
    }
  }, {
    ...base,
    name: 'test_B',
    script: 'src/services/test.js',
    env: {
      SERVICE_REGISTRY_LIST: 'localhost:8082;localhost:8081',
      TESTED_BY_NAME: 'B'
    }
  }]
}
