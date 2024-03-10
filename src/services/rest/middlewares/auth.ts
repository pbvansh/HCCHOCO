import Koa from 'koa'
import compose from 'koa-compose'
import jwt from 'koa-jwt'
import config from 'config'
import * as userQ from 'db/queries/users'
import * as commenQ from 'db/queries/common'
import { UserRoles } from 'types/user'
import mongoDB from 'db'
import { createTokenKey } from '../helpers/token'

export default (...userRoles: UserRoles[]) =>
  compose([
    jwt({
      secret: config.jwt.secret,
    }),
    async (ctx: Koa.DefaultContext, next: Function) => {
      const { userId, ownerId, role, tokenKey } = ctx.state.user

      //check role allowed or not
      if (!userRoles.includes(role)) {
        ctx.throw(401, 'Invalid role or You have not access of this feature')
      }

      //check user info
      const userInfo = await commenQ.findDocument(
        userQ.getCollection,
        mongoDB,
        {
          userId,
        },
      )
      if (!userInfo) {
        ctx.throw(401, 'User not found. Please signup')
      }

      //for team-member
      if (userId !== ownerId) {
        const ownerInfo = await commenQ.findDocument(
          userQ.getCollection,
          mongoDB,
          {
            userId: ownerId,
          },
        )
        if (!ownerInfo) {
          ctx.throw(401, 'Owner not found')
        }
      }

      // validate tokenKey
      if (tokenKey !== createTokenKey(userId, userInfo.password, role)) {
        ctx.throw(401, 'Authentication Error, Please login your account')
      }

      Object.assign(ctx.state.user, userInfo)
      return next()
    },
  ])
