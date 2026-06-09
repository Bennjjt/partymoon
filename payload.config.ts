import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './payload/collections/Media'
import { Trips } from './payload/collections/Trips'
import { Users } from './payload/collections/Users'

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
      connectionTimeoutMillis: 20_000,
    },
  }),
  sharp,
})
