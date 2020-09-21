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
  accountVerification
} from './controller'
import {
  loginValidation,
  signupValidation,
  logoutValidation,
  resetPasswordValidation,
  resetPassReqValidation,
  resetPassConfirmValidation,
  verifyAccountReqValidation,
  verifyAccountValidation
} from './validation'
import {validateUser} from '../../shared/user'
import validate from '../../shared/validateInput'

const router = Router()

router.get('/', validateUser, user)
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
  accountVerification
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
