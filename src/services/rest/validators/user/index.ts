import Koa from 'koa'
import { isValidString } from '../commen'
import err from 'services/rest/helpers/err'
import passwordTester from 'services/rest/helpers/passwordTester'
import md5 from 'md5'
import { isProtectedFieldsExist } from 'services/rest/helpers/fields'

export const isOldPasswordValid = async (ctx: Koa.DefaultContext) => {
  const { password } = ctx.request.body
  if (!password || !isValidString(password)) {
    return err('Please provide your old password', 'password')
  }

  const { password: userPassword } = ctx.state.user
  if (userPassword !== md5(password)) {
    return err('Invalid old password', 'password')
  }

  return null
}

export const isNewPasswordValid = async (ctx: Koa.DefaultContext) => {
  const { newPassword } = ctx.request.body
  if (!newPassword || !isValidString(newPassword)) {
    return err('Please provide new password', 'newPassword')
  }

  if (!passwordTester(newPassword)) {
    return err(
      'Weak password. Use at least 8 characters, alphanumeric, and 1 special character',
      'newPassword',
    )
  }

  return null
}

export const isConfirmPasswordValid = async (ctx: Koa.DefaultContext) => {
  const previousErros = ctx.state.validationErrors
  if (previousErros.length) {
    return null
  }

  const { confirmPassword, newPassword } = ctx.request.body

  if (!confirmPassword || !isValidString(confirmPassword)) {
    return err('Please provide confirm password', 'confirmPassword')
  }

  if (newPassword !== confirmPassword) {
    return err(
      'New password and confirm password does not match',
      'confirmPassword',
    )
  }

  return null
}

export const providedFieldsAreValid = (ctx: Koa.DefaultContext) => {
  if (!Object.keys(ctx.request.body).length) {
    return err('Please provide atleast one field to update', '')
  }
  if (isProtectedFieldsExist(ctx.request.body, ['firstName', 'lastName'])) {
    return err('Can not update protected fields', '')
  }
  return null
}

export const isFirstNameValid = (ctx: Koa.DefaultContext) => {
  if (!('firstName' in ctx.request.body)) return null
  const { firstName } = ctx.request.body

  if (typeof firstName === 'string' && !firstName.trim()) {
    return err('Please provide first name', 'firstName')
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
  if (!('lastName' in ctx.request.body)) return null
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
