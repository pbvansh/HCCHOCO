import Koa from 'koa'
import { isValidString } from './commen'
import err from '../helpers/err'
import emailTester from 'utils/emailTester'

export default (ctx: Koa.DefaultContext) => {
  const { email } = ctx.request.body
  if (!isValidString(email)) {
    return err('Please provide valid email address', 'email')
  }

  if (!emailTester(email)) {
    return err('Please provide valid email address', 'email')
  }

  ctx.state.modifiedFields = {
    ...(ctx.state.modifiedFields || {}),
    email: email.trim(),
  }
  return null
}
