import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

// Reuse a single connection in the same Node.js process (works across hot reloads in dev).
declare global {
  // eslint-disable-next-line no-var
  var __drizzleClient: ReturnType<typeof postgres> | undefined
}

function getClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }
  if (!globalThis.__drizzleClient) {
    globalThis.__drizzleClient = postgres(process.env.DATABASE_URL, { ssl: 'require' })
  }
  return globalThis.__drizzleClient
}

export const db = drizzle(getClient(), { schema })
