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

const router = Router()

router.get('/', user)
router.post('/login', login)
router.post('/signup', signup)
router.get('/logout', logout)
router.post('/accountVerification/request', verificationRequest)
router.post('/accountVerification/confirmation', verifyAccount)
router.post('/resetPassword', resetPassword)
router.post('/resetPassword/request', resetPasswordRequest)
router.get('/resetPassword/confirmation/:token', resetPasswordConfirmation)

export default router
