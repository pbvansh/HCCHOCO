//import all routes here
import Koa from 'koa'
import auth from './auth'
import user from './user'
import code from './code'

const entryPoints = [auth, user, code]

export default (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => {
  entryPoints.forEach(route => {
    app.use(route.routes()).use(route.allowedMethods())
  })
}
