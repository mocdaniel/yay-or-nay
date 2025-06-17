import { SQL, sql } from 'bun'

declare global {
  var __db: SQL | undefined
}

export default async function getDb(): Promise<SQL> {
  if (globalThis.__db) return globalThis.__db

  if (process.env.POSTGRES_URL === undefined) {
    console.error('POSTGRES_URL environment variable is not set.')
    process.exit(1)
  }

  try {
    console.log('Connecting to the database...')
    await sql.connect()
    console.log('Connected to the database successfully')

    console.log('Applying migrations...')
    await sql.file('migrations.sql')
    console.log('Applied migrations successfully')

    globalThis.__db = sql
    return globalThis.__db
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}
