import Koa from 'koa'
import errorHandler from 'koa-json-error'

interface Err {
  expose: boolean
  status: number
  message: number
  reasons: object[]
}

const formateError = (err: Err) => {
  console.log({ err })

  if (err.expose) {
    return {
      status: err.status || 400,
      message: err.message,
      reasons: err.reasons,
    }
  }
  return {
    status: 500,
    message: 'Internal Server Error',
  }
}

export default (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => {
  app.on('error', (err: Err, ctx: Koa.DefaultContext) => {
    console.log('SERVER CRACHED')
    console.log({ error: err })
  })
  //@ts-ignore
  app.use(errorHandler(formateError))
}
