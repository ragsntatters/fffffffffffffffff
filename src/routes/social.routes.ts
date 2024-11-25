import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/auth'
import {
  handleFacebookAuth,
  connectInstagramAccount,
  disconnectSocialAccounts
} from '../controllers/social.controller'

const router = Router()

router.use(authenticate)

router.post(
  '/auth/facebook',
  [body('shortLivedToken').notEmpty()],
  validate,
  handleFacebookAuth
)

router.post(
  '/connect/instagram',
  [body('pageId').notEmpty()],
  validate,
  connectInstagramAccount
)

router.post('/disconnect', disconnectSocialAccounts)

export default router