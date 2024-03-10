import Koa from 'koa'
import helmet from 'koa-helmet'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import logger from 'koa-logger'
import responseTime from 'koa-response-time'
import setupAPIs from './routes/index'
import errorHandler from './error'
require('dotenv').config()

const app = new Koa()

//setup error handeler
errorHandler(app)

//setup middlewares
app.use(responseTime())
app.use(helmet())
app.use(cors())
app.use(logger())
app.use(
  bodyParser({
    enableTypes: ['json'],
    onerror(err, ctx) {
      ctx.throw('Invalid Body', 422)
    },
  }),
)

setupAPIs(app)

export default app
