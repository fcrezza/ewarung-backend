import query from '../../store'

class User {
  async getUserByUsername(username) {
    const options = {
      sql:
        'select users.*, passwords.* from users left join passwords on users.id = passwords.idUser where users.username = ?',
      nestTables: true,
    }
    const results = await query(options, username)

    return results[0]
  }

  async getUserByEmail(email) {
    const results = await query('select * from users where email = ?', email)
    return results[0]
  }

  async changePassword(idUser, password) {
    await query('update passwords set password = ? where idUser = ?', [
      password,
      idUser,
    ])
  }
}

export default User
