import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool, defineDocuments} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'

const previewUrlOrigin = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'
const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET || ''

export default defineConfig({
  name: 'default',
  title: 'Partymoon',

  projectId: 'a6wgzngo',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: previewUrlOrigin,
        preview: '/',
        previewMode: {
          enable: `/api/draft-mode/enable?secret=${previewSecret}`,
        },
      },
      resolve: {
        locations: {
          trip: {
            select: {title: 'title', slug: 'slug.current'},
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
