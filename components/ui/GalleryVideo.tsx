'use client'

import { useState } from 'react'

interface GalleryVideoProps {
  src: string
  gradient: string  // shown blurred when the video fails to load
  className?: string
}

export function GalleryVideo({ src, gradient, className }: GalleryVideoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Blurred gradient fill */}
        <div
          className="absolute inset-0 scale-110"
          style={{ background: gradient, filter: 'blur(12px)' }}
        />
        {/* Dark veil */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
        {/* Camera icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
