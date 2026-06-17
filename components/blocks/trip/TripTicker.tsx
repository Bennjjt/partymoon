'use client'

import { Diamond } from 'lucide-react'
import type { TripInclusion } from '@/lib/data/trips'

interface TripTickerProps {
  destination: string
  inclusions?: TripInclusion[]
}

export function TripTicker({ destination, inclusions }: TripTickerProps) {
  const SEP = '◆'
  const items = inclusions?.length
    ? inclusions.flatMap(inc => [inc.title, SEP])
    : [destination, SEP, 'VIP CLUB NIGHTS', SEP, 'LUXURY HOTEL', SEP, 'FULLY HOSTED', SEP, 'PRIVATE TRANSFERS', SEP]

  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden py-4 relative z-10"
      style={{ background: 'var(--pm-purple)' }}
    >
      <div
        className="ticker-track flex gap-0 whitespace-nowrap"
        style={{ animation: 'tickerScroll 28s linear infinite' }}
      >
        {doubled.map((item, i) =>
          item === SEP ? (
            <span key={i} className="px-8 flex-shrink-0 inline-flex items-center" style={{ color: 'rgba(8,8,8,0.35)' }}>
              <Diamond size={7} fill="currentColor" strokeWidth={0} />
            </span>
          ) : (
            <span
              key={i}
              className="font-heading text-[0.9rem] tracking-[0.3em] flex-shrink-0"
              style={{ color: 'var(--pm-midnight)' }}
            >
              {item}
            </span>
          )
        )}
      </div>
      <style>{`@keyframes tickerScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } } @media (prefers-reduced-motion: reduce) { .ticker-track { animation-play-state: paused !important; } }`}</style>
    </div>
  )
}
