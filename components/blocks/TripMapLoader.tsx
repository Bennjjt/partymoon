'use client'

import dynamic from 'next/dynamic'

// dynamic + ssr:false must live inside a client component —
// this wrapper lets the server page import it safely.
const TripMap = dynamic(() => import('./TripMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full animate-pulse"
      style={{ height: '420px', background: 'var(--pm-deep)' }}
    />
  ),
})

interface Props {
  latitude: number
  longitude: number
  destination: string
}

export function TripMapLoader(props: Props) {
  return <TripMap {...props} />
}
