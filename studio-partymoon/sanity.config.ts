import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'

const previewUrlOrigin = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

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
          enable: '/api/draft-mode/enable',
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
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
