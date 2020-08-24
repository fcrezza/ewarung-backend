import query from '../../store'

class User {
  async getUserByUsername(username) {
    const options = {
      sql:
        'select users.*, passwords.*, stores.* from users left join passwords on users.id = passwords.idUser left join stores on users.id = stores.idUser where users.username = ?',
      nestTables: true
    }
    const results = await query(options, username)
    return results[0]
  }

  async getUserByID(id) {
    const options = {
      sql:
        'select users.*, passwords.*, stores.* from users left join passwords on users.id = passwords.idUser left join stores on users.id = stores.idUser where users.id = ?',
      nestTables: true
    }
    const results = await query(options, id)
    return results[0]
  }

  async getUserByEmail(email) {
    const results = await query('select * from users where email = ?', email)
    return results[0]
  }

  async changePassword(idUser, password) {
    await query('update passwords set password = ? where idUser = ?', [
      password,
      idUser
    ])
  }

  async register(data) {
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

  async verifyAccount(id) {
    await query('update users set isVerified = 1 where id = ?', id)
  }
}

const userInstance = new User()

export default userInstance
