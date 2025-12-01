import { exec } from 'child_process'
import { promisify } from 'util'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

/**
 * Run pending Prisma migrations
 * This should be called when the app starts, before any database operations
 */
export const runMigrations = async (): Promise<void> => {
  try {
    console.log('Checking for pending migrations...')

    // Get the database path
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'quotify.db')

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })

    // Set the DATABASE_URL environment variable for the migration
    const databaseUrl = `file:${dbPath}`
    const env = {
      ...process.env,
      DATABASE_URL: databaseUrl,
    }

    // In production (packaged app), we need to deploy migrations
    if (app.isPackaged) {
      console.log('Running migrations in production mode...')

      // Use prisma migrate deploy for production
      // This applies all pending migrations without prompting
      const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
        env,
        cwd: process.cwd(),
      })

      if (stdout) console.log('Migration output:', stdout)
      if (stderr) console.error('Migration warnings:', stderr)

      console.log('Migrations applied successfully')
    } else {
      // In development, we can use migrate dev or just connect
      console.log('Development mode: skipping automatic migrations')
      console.log('Run "npx prisma migrate dev" manually to create/apply migrations')
    }
  } catch (error) {
    console.error('Failed to run migrations:', error)
    // Don't throw - we might be dealing with a fresh database
    // that needs the initial migration
    console.log('Continuing without migrations - database might need initialization')
  }
}

/**
 * Check if the database exists and has been initialized
 */
export const isDatabaseInitialized = (): boolean => {
  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'quotify.db')
  return fs.existsSync(dbPath)
}
