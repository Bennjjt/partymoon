'use client'

import dynamic from 'next/dynamic'

const NextStudio = dynamic(() => import('./Studio'), { ssr: false })

export default function StudioPage() {
  return <NextStudio />
}
