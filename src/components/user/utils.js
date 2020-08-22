import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import tokenConfig from './config'
import query from '../../store'

function createAccessToken(idUser) {
  return jwt.sign(
    {
      user: {
        id: idUser
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: tokenConfig.accessTokenExpires.toString()
    }
  )
}

function createRefreshToken(idUser) {
  return jwt.sign(
    {
      user: {
        id: idUser
      }
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: tokenConfig.refreshTokenExpires.toString()
    }
  )
}

function validateRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
  } catch (err) {
    return false
  }
}

function validateAccessToken(token) {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  } catch (err) {
    return false
  }
}

async function saveToken(token) {
  await query('insert into tokens (token) values (?)', token)
}

async function invalidateToken(token) {
  await query('update tokens set isValid = 0 where token = ?', token)
}

async function getToken(token) {
  const tokens = await query('select * from tokens where token = ?', token)
  return tokens[0]
}

async function sendEmail(emailData) {
  const {to, subject, message} = emailData
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  await transporter.sendMail({
    from: '"ewarung" <no-reply@ewarung.com>',
    to,
    subject,
    text: message
  })
}

export {
  createAccessToken,
  createRefreshToken,
  validateAccessToken,
  validateRefreshToken,
  getToken,
  saveToken,
  invalidateToken,
  sendEmail
}
