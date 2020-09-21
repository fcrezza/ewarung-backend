import nodemailer from 'nodemailer'

import query from '../../store'

export async function getUserByUsername(username) {
  const options = {
    sql:
      'select users.*, passwords.*, stores.* from users left join passwords on users.id = passwords.idUser left join stores on users.id = stores.idUser where users.username = ?',
    nestTables: true
  }
  const results = await query(options, username)
  return results[0]
}

export async function getUserByID(id) {
  const options = {
    sql:
      'select users.*, passwords.*, stores.* from users left join passwords on users.id = passwords.idUser left join stores on users.id = stores.idUser where users.id = ?',
    nestTables: true
  }
  const results = await query(options, id)
  return results[0]
}

export async function getUserByEmail(email) {
  const results = await query('select * from users where email = ?', email)
  return results[0]
}

export async function changePassword(idUser, password) {
  await query('update passwords set password = ? where idUser = ?', [
    password,
    idUser
  ])
}

export async function register(data) {
  const {email, username, password} = data
  const user = await query(
    'insert into users (username, email) values (?, ?)',
    [username, email]
  )
  await query('insert into passwords (password, idUser) values (?, ?)', [
    password,
    user.insertId
  ])
}

export async function verifyAccount(id) {
  await query('update users set isVerified = 1 where id = ?', id)
}

export async function getToken(token) {
  const tokens = await query('select * from tokens where token = ?', token)
  return tokens[0]
}

export async function sendEmail(emailData) {
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
