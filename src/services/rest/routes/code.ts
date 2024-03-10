import Router from 'koa-router'
import auth from '../middlewares/auth'
import validate from '../middlewares/validate'
import { saveCode } from '../controllers/code'
import {
  isPlateNameValid,
  isDescValid,
  isValidTags,
  isLanguageValid,
  isSnippetValid,
} from '../validators/code'

const router = new Router({ prefix: '/code' })

router.post(
  '/save',
  auth('O', 'A', 'T'),
  validate([
    isPlateNameValid,
    isDescValid,
    isValidTags,
    isLanguageValid,
    isSnippetValid,
  ]),
  saveCode,
)

export default router
