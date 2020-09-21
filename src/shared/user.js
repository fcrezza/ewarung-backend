import config from 'config'

import {
  createAccessToken,
  createRefreshToken,
  validateAccessToken,
  validateRefreshToken,
  invalidateToken,
  saveToken
} from './token'

const {refreshTokenExpires, accessTokenExpires} = config.get('token')

export async function validateUser(req, res, next) {
  let {accessToken, refreshToken} = req.cookies
  const accessTokenValidation = validateAccessToken(accessToken)
  if (!accessTokenValidation) {
    const refreshTokenValidation = validateRefreshToken(refreshToken)
    if (!refreshTokenValidation) {
      return res.json({
        code: 401,
        status: 'unauthenticated',
        userData: null
      })
    }
    await invalidateToken(refreshToken)
    req.user = {
      id: refreshTokenValidation.user.id
    }
    accessToken = createAccessToken(refreshTokenValidation.user.id)
    refreshToken = createRefreshToken(refreshTokenValidation.user.id)
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
    return next()
  }

  req.user = {
    id: accessTokenValidation.user.id
  }
  next()
}
