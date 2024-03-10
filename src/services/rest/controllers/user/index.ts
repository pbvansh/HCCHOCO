import Koa from 'koa'
import * as userQ from 'db/queries/users'
import * as commenQ from 'db/queries/common'
import mongoDB from 'db'
import md5 from 'md5'
import { createJwt, createTokenKey } from 'services/rest/helpers/token'
import config from 'config'
import { removeUndefinedValues } from 'services/rest/helpers/fields'

export const userSetting = async (ctx: Koa.DefaultContext) => {
  const { userId, ownerId, role, email, firstName, lastName, lastLoginAt } =
    ctx.state.user || {}

  const setting = Object.assign(
    {},
    {
      userId,
      ownerId,
      role,
      email,
      firstName,
      lastName,
      lastLoginAt,
    },
  )

  if (role !== 'O') {
    const ownerDetails = await userQ.getAllOwners(mongoDB, userId)
    Object.assign(setting, { ownerDetails })
  }

  ctx.body = {
    message: 'User setting fetched successfully',
    response: { setting },
  }
}

export const changePassword = async (ctx: Koa.DefaultContext) => {
  const { newPassword } = ctx.request.body
  const { userId, ownerId, role } = ctx.state.user

  const password = md5(newPassword)
  console.log({ password })

  await commenQ.updateDocument(
    userQ.getCollection,
    mongoDB,
    { userId },
    {
      $set: {
        password,
      },
    },
  )
  const token = createJwt(
    {
      userId,
      ownerId,
      role,
      tokenKey: createTokenKey(userId, password, role),
    },
    config.jwt.secret,
  )

  ctx.body = {
    message: 'Password changed successfully',
    response: { token },
  }
}

export const editUser = async (ctx: Koa.DefaultContext) => {
  const { userId } = ctx.state.user
  const { firstName, lastName } = ctx.state.modifiedFields
  const dataToUpdate = removeUndefinedValues({ firstName, lastName })

  await commenQ.updateDocument(
    userQ.getCollection,
    mongoDB,
    { userId },
    dataToUpdate,
  )

  ctx.body = {
    message: 'User details updated successfully',
  }
}
