import { Pool } from 'pg'
import { config } from '../config'
import { logger } from '../utils/logger'

const pool = new Pool({
  connectionString: config.db.url,
  min: config.db.poolMin,
  max: config.db.poolMax,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err)
})

export async function checkPool() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    client.release()
    return result.rows[0]
  } catch (error) {
    logger.error('Database pool check failed:', error)
    throw error
  }
}

export async function closePool() {
  await pool.end()
  logger.info('Database pool closed')
}

export { pool }