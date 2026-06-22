import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-05-15',
  useCdn: process.env.NODE_ENV === 'production',
})

// Used only when Next.js draft mode is active (Presentation tool preview).
// Reads drafts with the viewer token and bypasses the CDN so edits show up live.
export const draftClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-05-15',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'previewDrafts',
})

export function getClient(preview: boolean) {
  return preview ? draftClient : client
}
