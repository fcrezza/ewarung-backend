import jwt from 'jsonwebtoken'
import config from 'config'

import query from '../store'

const {accessTokenExpires, refreshTokenExpires} = config.get('token')

export function createAccessToken(id) {
  return jwt.sign(
    {
      user: {
        id
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: accessTokenExpires.toString()
    }
  )
}

export function createRefreshToken(id) {
  return jwt.sign(
    {
      user: {
        id
      }
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: refreshTokenExpires.toString()
    }
  )
}

export function validateRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
  } catch (err) {
    return false
  }
}

export function validateAccessToken(token) {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  } catch (err) {
    return false
  }
}

export async function saveToken(token) {
  await query('insert into tokens (token) values (?)', token)
}

export async function invalidateToken(token) {
  await query('update tokens set isValid = 0 where token = ?', token)
}
