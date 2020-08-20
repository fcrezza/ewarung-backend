import {Router} from 'express'

import {
  login,
  logout,
  user,
  resetPassword,
  resetPasswordRequest,
  resetPasswordConfirmation,
} from './controller'

const router = Router()

router.get('/', user)
router.post('/login', login)
router.get('/logout', logout)
router.post('/resetPassword', resetPassword)
router.post('/resetPassword/request', resetPasswordRequest)
router.get('/resetPassword/confirmation/:token', resetPasswordConfirmation)

export default router
