import bcrypt from 'bcrypt'
import config from 'config'

import {
  UnauthorizedError,
  NotFoundError,
  ForbiddenError
} from '../../shared/error'
import {
  saveToken,
  invalidateToken,
  createAccessToken,
  createRefreshToken,
  validateAccessToken
} from '../../shared/token'
import {
  getToken,
  sendEmail,
  getUserByUsername,
  getUserByID,
  getUserByEmail,
  changePassword,
  register,
  verifyAccount
} from './utils'

const {accessTokenExpires, refreshTokenExpires} = config.get('token')

async function login(req, res) {
  const {username, password} = req.body
  const userData = await getUserByUsername(username)
  if (!userData) {
    throw new NotFoundError(
      `Tidak ditemukan pengguna dengan username ${username}`
    )
  } else if (!bcrypt.compareSync(password, userData.passwords.password)) {
    throw new UnauthorizedError(
      'Password yang dimasukan tidak cocok cocok dengan username'
    )
  } else {
    const accessToken = createAccessToken(userData.users.id)
    const refreshToken = createRefreshToken(userData.users.id)
    await saveToken(refreshToken)
    res
      .cookie('accessToken', accessToken, {
        maxAge: accessTokenExpires,
        httpOnly: true
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: refreshTokenExpires,
        httpOnly: true
      })
      .json({
        status: 'success',
        userData: {
          user: userData.users,
          store: userData.stores
        }
      })
  }
}

async function signup(req, res) {
  let {username, email, password} = req.body
  const isUsernameExist = await getUserByUsername(username)
  if (isUsernameExist) {
    throw new ForbiddenError({
      name: 'username',
      message: 'Username tidak tersedia'
    })
  }

  const isEmailExist = await getUserByEmail(email)
  if (isEmailExist) {
    throw new ForbiddenError({
      name: 'email',
      message: 'Sudah ada yang menggunakan email ini'
    })
  }
  password = bcrypt.hashSync(password, 10)

  await register({
    email,
    username,
    password
  })

  res.json({
    code: 200,
    status: 'success',
    message: 'regitration success'
  })
}

async function logout(req, res) {
  await invalidateToken(req.cookies['refreshToken'])
  res.clearCookie('accessToken').clearCookie('refreshToken').json({
    code: 200,
    status: 'success',
    message: 'logout success'
  })
}

async function user(req, res) {
  const userData = await getUserByID(req.user.id)
  res.json({
    code: 200,
    status: 'success',
    userData: {
      user: userData.users,
      store: userData.stores
    }
  })
}

async function resetPassword(req, res) {
  let {token, newPassword} = req.body
  const accessToken = validateAccessToken(token)
  if (!accessToken) {
    throw new UnauthorizedError('Gagal mereset password, token tidak valid')
  }
  const dbToken = await getToken(token)

  if (!dbToken.isValid) {
    throw new UnauthorizedError('Gagal mereset password, token tidak valid')
  }

  newPassword = bcrypt.hashSync(newPassword, 10)
  await changePassword(accessToken.user.id, newPassword)
  await invalidateToken(token)
  res.json({
    code: 200,
    status: 'success',
    message: 'berhasil mereset password'
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
    message: 'URL valid'
  })
}

async function resetPasswordRequest(req, res) {
  const userData = await getUserByEmail(req.body.email)
  if (!userData) {
    throw new NotFoundError('Tidak ditemukan pengguna dengan email ini')
  }

  const token = createAccessToken(userData.id)
  await saveToken(token)
  await sendEmail({
    to: req.body.email,
    subject: 'Reset password request',
    message: `halo, klik tautan berikut untuk melanjutkan reset password akun anda ${req.headers.origin}/resetPassword/changePassword/${token}. url berlaku selama 30 menit`
  })

  res.json({status: 'success', message: 'success sending email'})
}

async function verificationRequest(req, res) {
  const {username} = req.body
  const userData = await getUserByUsername(username)
  const token = createAccessToken(userData.users.id)
  await saveToken(token)
  await sendEmail({
    to: userData.users.email,
    subject: 'Verifikasi akun',
    message: `Klik pada tautan berikut untuk menverifikasi akun ${req.headers.origin}/accountVerification/confirmation/${token}. tautan verifikasi berlaku selama 30 menit`
  })
  res.json({
    code: 200,
    status: 'success',
    message: 'berhasil mengirim email verifikasi'
  })
}

async function accountVerification(req, res) {
  const {token} = req.body
  const accessToken = validateAccessToken(token)
  if (!accessToken) {
    throw new NotFoundError('Token tidak valid')
  }
  const dbToken = await getToken(token)
  if (!dbToken.isValid) {
    throw new NotFoundError('Token tidak valid')
  }
  await verifyAccount(accessToken.user.id)
  await invalidateToken(token)

  res.json({
    code: 200,
    status: 'success',
    message: 'verification account success'
  })
}

export {
  login,
  signup,
  logout,
  user,
  resetPassword,
  resetPasswordRequest,
  resetPasswordConfirmation,
  verificationRequest,
  accountVerification
}
