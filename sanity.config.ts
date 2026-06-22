import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool, defineDocuments } from 'sanity/presentation'
import { schemaTypes } from './sanity/schemaTypes'

// Studio is embedded in the Next.js app, so Presentation can use a relative
// origin and there's no cross-site iframe — no third-party cookie issues.
const previewOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const previewSecret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || ''

export default defineConfig({
  name: 'default',
  title: 'Partymoon',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/admin',

  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        preview: '/',
        previewMode: {
          enable: `/api/draft-mode/enable?secret=${previewSecret}`,
        },
      },
      resolve: {
        locations: {
          trip: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled trip',
                  href: `/${doc?.slug}`,
                },
              ],
            }),
          },
        },
        mainDocuments: defineDocuments([
          {
            route: '/:slug',
            filter: `_type == "trip" && slug.current == $slug`,
          },
        ]),
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
