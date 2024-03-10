import koa from 'koa'
import passwordTester from '../helpers/passwordTester'
import err from '../helpers/err'

export default (ctx: koa.DefaultContext) => {
  const { password } = ctx.request.body
  const isLogin = ctx.path.includes('/login')

  if (!(typeof password === 'string' && password.trim())) {
    return err('Please provide valid password', 'password')
  }

  if (!isLogin && !passwordTester(password)) {
    return err(
      'Weak password. Use at least 8 characters, alphanumeric, and 1 special character',
      'password',
    )
  }

  ctx.state.modifiedFields = {
    ...(ctx.state.modifiedFields || {}),
    password: password.trim(),
  }

  return null
}
