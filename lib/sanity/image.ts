import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const { projectId, dataset } = client.config()

const builder = createImageUrlBuilder({ projectId: projectId!, dataset: dataset! })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}
