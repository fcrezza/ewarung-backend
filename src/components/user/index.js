import {Router} from 'express'

import {
  login,
  logout,
  signup,
  user,
  resetPassword,
  resetPasswordRequest,
  resetPasswordConfirmation,
  verificationRequest,
  verifyAccount
} from './controller'
import {
  validate,
  loginValidation,
  signupValidation,
  logoutValidation,
  resetPasswordValidation,
  resetPassReqValidation,
  resetPassConfirmValidation,
  verifyAccountReqValidation,
  verifyAccountValidation
} from './validation'

const router = Router()

router.get('/', user)
router.post('/login', validate(loginValidation), login)
router.post('/signup', validate(signupValidation), signup)
router.get('/logout', validate(logoutValidation), logout)
router.post(
  '/accountVerification/request',
  validate(verifyAccountReqValidation),
  verificationRequest
)
router.post(
  '/accountVerification/confirmation',
  validate(verifyAccountValidation),
  verifyAccount
)
router.post('/resetPassword', validate(resetPasswordValidation), resetPassword)
router.post(
  '/resetPassword/request',
  validate(resetPassReqValidation),
  resetPasswordRequest
)
router.get(
  '/resetPassword/confirmation/:token',
  validate(resetPassConfirmValidation),
  resetPasswordConfirmation
)

export default router
