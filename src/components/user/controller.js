import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

import {UnauthorizedError, NotFoundError} from '../../utils/error'
import {
  createAccessToken,
  createRefreshToken,
  validateAccessToken,
  validateRefreshToken,
  getToken,
  saveToken,
  invalidateToken,
} from './utils'
import UserInstance from './services'
import tokenConfig from './config'

const User = new UserInstance()

async function login(req, res) {
  const {username, password} = req.body
  const userData = await User.getUserByUsername(username)

  if (!userData) {
    throw new NotFoundError(
      `Tidak ditemukan pengguna dengan username ${username}`
    )
  } else if (!bcrypt.compareSync(password, userData.passwords.password)) {
    throw new UnauthorizedError(
      'Password yang dimasukan tidak cocok cocok dengan username'
    )
  } else if (!userData.users.isVerified) {
    throw new UnauthorizedError('Lakukan verifikasi akun terlebih dahulu')
  } else {
    const accessToken = createAccessToken(userData.users.id)
    const refreshToken = createRefreshToken(userData.users.id)
    await saveToken(refreshToken)
    res
      .cookie('accessToken', accessToken, {
        maxAge: tokenConfig.accessTokenExpires,
        httpOnly: true,
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: tokenConfig.refreshTokenExpires,
        httpOnly: true,
      })
      .json({
        status: 'success',
        user: {
          id: userData.users.id,
        },
      })
  }
}

function signup(req, res) {
  console.log('signup')
}

async function logout(req, res) {
  await invalidateToken(req.cookies['refreshToken'])
  res.clearCookie('accessToken').clearCookie('refreshToken').json({
    status: 'success',
    message: 'logout success',
  })
}

async function user(req, res) {
  let accessToken = validateAccessToken(req.cookies['accessToken'])
  if (!accessToken) {
    let refreshToken = validateRefreshToken(req.cookies['refreshToken'])
    if (!refreshToken) {
      throw new UnauthorizedError('Login terlebih dahulu')
    }
    await invalidateToken(req.cookies['refreshToken'])
    accessToken = createAccessToken(refreshToken.user.idUser)
    refreshToken = createRefreshToken(refreshToken.user.idUser)
    await saveToken(refreshToken)
    res
      .cookie('accessToken', accessToken, {
        maxAge: tokenConfig.accessTokenExpires,
        httpOnly: true,
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: tokenConfig.refreshTokenExpires,
        httpOnly: true,
      })
      .json({
        status: 'success',
        user: req.user,
      })
  } else {
    res.json({
      status: 'success',
      user: accessToken.user,
    })
  }
}

async function resetPassword(req, res) {
  const {token, newPassword} = req.body
  const accessToken = validateAccessToken(token)
  if (!accessToken) {
    throw new UnauthorizedError('Gagal mereset password, token tidak valid')
  }
  const dbToken = await getToken(token)
  console.log('1st log')
  if (!dbToken.isValid) {
    throw new UnauthorizedError('Gagal mereset password, token tidak valid')
  }
  console.log('2nd log')
  await User.changePassword(accessToken.user.id, newPassword)
  await invalidateToken(token)
  res.json({
    code: 200,
    status: 'success',
    message: 'berhasil mereset password',
  })
}

async function resetPasswordConfirmation(req, res) {
  const {token} = req.params
  let accessToken = validateAccessToken(token)
  if (!accessToken) {
    throw new NotFoundError('URL tidak valid')
  }
  accessToken = await getToken(token)
  if (!accessToken.isValid) {
    throw new NotFoundError('URL tidak valid')
  }

  res.json({
    code: 200,
    status: 'success',
    message: 'URL valid',
  })
}

async function resetPasswordRequest(req, res) {
  const userData = await User.getUserByEmail(req.body.email)
  if (!userData) {
    throw new NotFoundError('Tidak ditemukan pengguna dengan email ini')
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const token = createAccessToken(userData.id)
  await saveToken(token)
  await transporter.sendMail({
    from: '"ewarung" <no-reply@ewarung.com>',
    to: req.body.email,
    subject: 'Reset password request',
    text: `halo, klik tautan berikut untuk melanjutkan reset password akun anda ${req.headers.origin}/resetPassword/changePassword/${token}. url berlaku selama 30 menit`,
  })

  res.json({status: 'success', message: 'success sending email'})
}

export {
  login,
  signup,
  logout,
  user,
  resetPassword,
  resetPasswordRequest,
  resetPasswordConfirmation,
}
