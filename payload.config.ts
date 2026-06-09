import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './payload/collections/Media'
import { Trips } from './payload/collections/Trips'
import { Users } from './payload/collections/Users'

// #region agent log
try { require('fs').appendFileSync('/Users/benjaminthorne/Documents/BEARA/PartyMoon/.cursor/debug-f68b23.log', JSON.stringify({ sessionId: 'f68b23', timestamp: Date.now(), location: 'payload.config.ts:module-eval', message: 'payload.config.ts evaluated at module load time', hypothesisId: 'H-E' }) + '\n') } catch {}
// #endregion

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor(),
  collections: [Users, Media, Trips],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    // Drizzle schema push on every cold start blocks SSR for minutes ("Pulling schema
    // from database…"). Run `npm run payload migrate` after collection schema changes.
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      connectionTimeoutMillis: 15_000,
    },
  }),
  sharp,
})
