import mysql from 'mysql2/promise'
import config from 'config'

const dbConfig = config.get('database')
export const pool = mysql.createPool(dbConfig)

async function query(statement, placeholder) {
  const connection = await pool.getConnection()
  if (placeholder) {
    const [rows] = await connection.query(statement, placeholder)
    connection.release()
    return rows
  }
  const [rows] = await connection.query(statement)
  connection.release()
  return rows
}

export default query
