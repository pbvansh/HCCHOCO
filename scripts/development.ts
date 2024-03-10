import { config as loadEnvirement } from 'dotenv'
import path from 'path'
loadEnvirement()

process.env.NODE_PATH = 'src'
console.log({ NODE_PATH: process.env.NODE_PATH })

const serviceName = process.env.SERVICE || '/'
const servicePath = path.join('..', 'src', 'services', serviceName)
console.log({ servicePath })

// is used to refresh and initialize the global search paths for Node.js modules,
// allowing for dynamic modification or extension of module resolution behavior during runtime.
require('module').Module._initPaths()

process.on('unhandledRejection', err => {
  console.log(err)
  throw err
})

require(servicePath)
// import * as all from  `${path.join('src', 'services', serviceName)}`
