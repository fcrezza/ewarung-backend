import mysql from 'mysql2/promise'

import config from './config'

const pool = mysql.createPool(config)

async function query(statement, placeholder) {
  try {
    const connection = await pool.getConnection()
    if (placeholder.length) {
      const [rows] = await connection.query(statement, placeholder)
      connection.release()
      return rows
    } else {
      const [rows] = await connection.query(statement)
      connection.release()
      return rows
    }
  } catch (error) {
    throw new Error(error)
  }
}

export default query
