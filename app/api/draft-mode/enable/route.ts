import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { draftClient } from '@/lib/sanity/client'

export const { GET } = defineEnableDraftMode({
  client: draftClient,
})
