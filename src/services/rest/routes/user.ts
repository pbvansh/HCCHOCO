import Router from 'koa-router'
import auth from '../middlewares/auth'
import { changePassword, editUser, userSetting } from '../controllers/user'
import validate from '../middlewares/validate'
import {
  isConfirmPasswordValid,
  isFirstNameValid,
  isLastNameValid,
  isNewPasswordValid,
  isOldPasswordValid,
  providedFieldsAreValid,
} from '../validators/user'

const router = new Router({
  prefix: '/user',
})

router.get('/setting', auth('O', 'A', 'T'), userSetting)

router.post(
  '/change-password',
  auth('O', 'A', 'T'),
  validate([isOldPasswordValid, isNewPasswordValid, isConfirmPasswordValid]),
  changePassword,
)

router.put(
  '/edit',
  auth('A', 'O', 'T'),
  validate([providedFieldsAreValid, isFirstNameValid, isLastNameValid]),
  editUser,
)

export default router
