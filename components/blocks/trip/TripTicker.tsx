'use client'

import type { TripInclusion } from '@/lib/data/trips'

interface TripTickerProps {
  destination: string
  inclusions?: TripInclusion[]
}

export function TripTicker({ destination, inclusions }: TripTickerProps) {
  const items = inclusions?.length
    ? inclusions.flatMap(inc => [inc.title, '✦'])
    : [destination, '✦', 'VIP CLUB NIGHTS', '✦', 'LUXURY HOTEL', '✦', 'FULLY HOSTED', '✦', 'PRIVATE TRANSFERS', '✦']

  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden py-4 relative z-10"
      style={{ background: 'linear-gradient(90deg, var(--pm-purple), #9D4EDD, #FF2D78, #9D4EDD, var(--pm-purple))' }}
    >
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{ animation: 'tickerScroll 28s linear infinite' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-heading text-[0.9rem] tracking-[0.3em] text-white px-10 flex-shrink-0"
            style={{ opacity: item === '✦' ? 0.4 : 1 }}
          >
            {item}
          </span>
        ))}
      </div>
      <style>{`@keyframes tickerScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  )
}
