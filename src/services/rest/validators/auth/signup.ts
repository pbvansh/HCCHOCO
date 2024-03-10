import Koa from 'koa'
import { isValidString } from '../commen'
import err from 'services/rest/helpers/err'
import * as commenQ from 'db/queries/common'
import * as userQ from 'db/queries/users'
import mongoDB from 'db'
import md5 from 'md5'
import { OwnerDetail } from 'types/user'

export const isLoginValid = async (ctx: Koa.DefaultContext) => {
  const previousErros = ctx.state.validationErrors
  if (previousErros.length) return null

  const { email, password } = ctx.state.modifiedFields
  const userInfo = await commenQ.findDocument(userQ.getCollection, mongoDB, {
    email,
    password: md5(password),
  })
  if (!userInfo) {
    return err('Invalid user credentials', 'email')
  }

  let role = 'O'
  if (userInfo.userId !== userInfo.ownerId && userInfo.ownerDetails) {
    const currentOwner = userInfo.ownerDetails.find(
      (owner: OwnerDetail) => owner.ownerId === userInfo.ownerId,
    )
    if (!currentOwner) {
      ctx.throw(401, 'Authentication Error, Please contact to your owner')
    }
    role = currentOwner.role
  }

  Object.assign(userInfo, { role })

  ctx.state.shared = {
    ...(ctx.state.shared || {}),
    userInfo,
  }

  return null
}

export const isFirstNameValid = (ctx: Koa.DefaultContext) => {
  const { firstName } = ctx.request.body
  if (!isValidString(firstName)) {
    return err('Please provide valid first name', 'firstName')
  }
  if (firstName.length < 3 || firstName.length > 30) {
    return err('First name should beetween 3 to 30 character', 'firstName')
  }

  ctx.state.modifiedFields = {
    ...(ctx.state.modifiedFields || {}),
    firstName: firstName.trim(),
  }
  return null
}

export const isLastNameValid = (ctx: Koa.DefaultContext) => {
  const { lastName } = ctx.request.body

  if (!isValidString(lastName, false)) {
    return err('Please provide valid last name', 'lastName')
  }
  const userLastName =
    (lastName && typeof lastName === 'string' && lastName.trim()) || ''

  ctx.state.modifiedFields = {
    ...(ctx.state.modifiedFields || {}),
    lastName: userLastName.trim(),
  }

  return null
}

export const isEmailAlreadyExist = async (ctx: Koa.DefaultContext) => {
  const previousErros = ctx.state.validationErrors
  if (previousErros.length) return null

  const { email } = ctx.request.body

  const emailExist = await commenQ.findDocument(userQ.getCollection, mongoDB, {
    email,
  })

  console.log({ emailExist })
  if (emailExist) {
    return err('This email is already registerd with us', 'email')
  }

  return null
}
