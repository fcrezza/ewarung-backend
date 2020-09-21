import {body, cookie, param} from 'express-validator'

export const loginValidation = [
  body('username').notEmpty().withMessage('username tidak boleh kosong'),
  body('password')
    .notEmpty()
    .withMessage('password tidak boleh kosong')
    .bail()
    .isLength({min: 8})
    .withMessage('password minimal mengandung 8 karakter')
]

export const signupValidation = [
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

export const logoutValidation = [
  cookie('refreshToken').notEmpty().withMessage('invalid refreshToken')
]

export const resetPasswordValidation = [
  body('token').notEmpty().withMessage('invalid token'),
  body('newPassword')
    .notEmpty()
    .bail()
    .withMessage('password tidak boleh kosong')
    .bail()
    .isLength({min: 8})
    .withMessage('password minimal mengandung 8 karakter')
]

export const resetPassConfirmValidation = [
  param('token').notEmpty().withMessage('invalid token')
]

export const resetPassReqValidation = [
  body('email').normalizeEmail().isEmail().withMessage('Email tidak valid')
]

export const verifyAccountValidation = [
  body('token').notEmpty().withMessage('invalid token')
]
export const verifyAccountReqValidation = [
  body('username').notEmpty().withMessage('username tidak boleh kosong')
]
