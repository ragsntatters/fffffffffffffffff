import { Router } from 'express'
import { body, query } from 'express-validator'
import { validate } from '../middleware/validate'
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout
} from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty()
  ],
  validate,
  register
)

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  validate,
  login
)

router.get(
  '/verify-email',
  [query('token').notEmpty()],
  validate,
  verifyEmail
)

router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  validate,
  forgotPassword
)

router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 })
  ],
  validate,
  resetPassword
)

router.post('/logout', authenticate, logout)

export default router