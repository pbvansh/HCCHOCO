import Koa from 'koa'
import Router from 'koa-router'
import {
  emailSpamSocre,
  emailValidatinAccuracy,
  login,
  signup,
} from '../controllers/auth'
import emailValidation from '../validators/emailValidation'
import validate from '../middlewares/validate'
import {
  isEmailAlreadyExist,
  isFirstNameValid,
  isLastNameValid,
  isLoginValid,
} from '../validators/auth/signup'
import passwordValidation from '../validators/passwordValidation'

const router = new Router({
  prefix: '/auth',
})

router.get(
  '/login',
  validate([emailValidation, passwordValidation, isLoginValid]),
  login,
)

router.post(
  '/signup',
  validate([
    emailValidation,
    isFirstNameValid,
    isLastNameValid,
    passwordValidation,
    isEmailAlreadyExist,
  ]),
  signup,
)

export default router
