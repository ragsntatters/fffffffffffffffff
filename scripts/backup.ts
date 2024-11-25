import { exec } from 'child_process'
import { promisify } from 'util'
import { config } from '../src/config'
import { logger } from '../src/utils/logger'

const execAsync = promisify(exec)

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `backup-${timestamp}.sql`
  const backupPath = `./backups/${filename}`

  try {
    // Parse database URL
    const url = new URL(config.db.url)
    const database = url.pathname.slice(1)
    const username = url.username
    const password = url.password
    const host = url.hostname
    const port = url.port

    // Set environment variables for pg_dump
    const env = {
      PGPASSWORD: password,
      ...process.env
    }

    // Run pg_dump
    const { stdout, stderr } = await execAsync(
      `pg_dump -h ${host} -p ${port} -U ${username} -F c -b -v -f ${backupPath} ${database}`,
      { env }
    )

    logger.info(`Database backup created successfully: ${backupPath}`)
    if (stderr) logger.debug(stderr)

    return backupPath
  } catch (error) {
    logger.error('Database backup failed:', error)
    throw error
  }
}

async function restoreDatabase(backupPath: string) {
  try {
    // Parse database URL
    const url = new URL(config.db.url)
    const database = url.pathname.slice(1)
    const username = url.username
    const password = url.password
    const host = url.hostname
    const port = url.port

    // Set environment variables for pg_restore
    const env = {
      PGPASSWORD: password,
      ...process.env
    }

    // Run pg_restore
    const { stdout, stderr } = await execAsync(
      `pg_restore -h ${host} -p ${port} -U ${username} -d ${database} -v ${backupPath}`,
      { env }
    )

    logger.info('Database restored successfully')
    if (stderr) logger.debug(stderr)
  } catch (error) {
    logger.error('Database restore failed:', error)
    throw error
  }
}

// CLI handling
const [,, command, backupPath] = process.argv

async function main() {
  try {
    switch (command) {
      case 'backup':
        await backupDatabase()
        break
      case 'restore':
        if (!backupPath) {
          throw new Error('Backup path is required for restore')
        }
        await restoreDatabase(backupPath)
        break
      default:
        console.log('Usage: npm run db:backup|db:restore [backup-path]')
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()