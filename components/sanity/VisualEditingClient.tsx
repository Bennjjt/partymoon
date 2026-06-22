'use client'

import { useRouter } from 'next/navigation'
import { VisualEditing } from 'next-sanity/visual-editing/client-component'

export function VisualEditingClient() {
  const router = useRouter()

  return (
    <VisualEditing
      refresh={async (payload) => {
        if (payload.source === 'manual' || payload.source === 'mutation') {
          router.refresh()
        }
      }}
    />
  )
}
