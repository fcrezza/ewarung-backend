import {body, cookie, param, validationResult} from 'express-validator'
import {BadRequestError} from '../../utils/error'

const customValidationResult = validationResult.withDefaults({
  formatter: (error) => ({name: error.param, message: error.msg})
})

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = customValidationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    throw new BadRequestError(errors.array())
  }
}

const loginValidation = [
  body('username').notEmpty().withMessage('username tidak boleh kosong'),
  body('password')
    .notEmpty()
    .withMessage('password tidak boleh kosong')
    .bail()
    .isLength({min: 8})
    .withMessage('password minimal mengandung 8 karakter')
]

const signupValidation = [
  body('username').notEmpty().withMessage('username tidak boleh kosong'),
  body('email').normalizeEmail().isEmail().withMessage('Email tidak valid'),
  body('password')
    .notEmpty()
    .bail()
    .withMessage('password tidak boleh kosong')
    .bail()
    .isLength({min: 8})
    .withMessage('password minimal mengandung 8 karakter')
]

const logoutValidation = [
  cookie('refreshToken').notEmpty().withMessage('invalid refreshToken')
]

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('invalid token'),
  body('newPassword')
    .notEmpty()
    .bail()
    .withMessage('password tidak boleh kosong')
    .bail()
    .isLength({min: 8})
    .withMessage('password minimal mengandung 8 karakter')
]

const resetPassConfirmValidation = [
  param('token').notEmpty().withMessage('invalid token')
]

const resetPassReqValidation = [
  body('email').normalizeEmail().isEmail().withMessage('Email tidak valid')
]

const verifyAccountValidation = [
  body('username').notEmpty().withMessage('username tidak boleh kosong')
]
const verifyAccountReqValidation = [
  body('token').notEmpty().withMessage('invalid token')
]

export {
  validate,
  loginValidation,
  signupValidation,
  logoutValidation,
  resetPasswordValidation,
  resetPassReqValidation,
  resetPassConfirmValidation,
  verifyAccountValidation,
  verifyAccountReqValidation
}
