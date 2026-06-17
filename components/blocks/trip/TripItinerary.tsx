import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { TripSectionHeader } from '@/components/blocks/trip/TripSectionHeader'

type ItineraryItem = {
  id?: string
  tag?: string | null
  day: number
  title: string
  description?: string | null
}

interface TripItineraryProps {
  itinerary: ItineraryItem[]
}

export function TripItinerary({ itinerary }: TripItineraryProps) {
  if (!itinerary.length) return null

  return (
    <section
      style={{
        background: 'var(--pm-deep)',
        borderTop: '1px solid rgba(var(--pm-purple-rgb),0.15)',
        borderBottom: '1px solid rgba(var(--pm-purple-rgb),0.15)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="px-6 md:px-12 py-24">
        <TripSectionHeader eyebrow="Hour by Hour" headline="YOUR WEEKEND." sub="laid out." />

        <ol className="space-y-0">
          {itinerary.map((item, i) => (
            <li
              key={item.id ?? item.day}
              className="grid"
              style={{
                gridTemplateColumns: '110px 1fr',
                borderBottom: i < itinerary.length - 1 ? '1px solid rgba(var(--pm-purple-rgb),0.1)' : 'none',
              }}
            >
              {/* Day marker */}
              <div
                className="flex flex-col items-center gap-2 py-8 px-4"
                style={{ borderRight: '1px solid rgba(var(--pm-purple-rgb),0.15)' }}
              >
                <p className="font-heading text-[2.5rem] leading-none" style={{ color: 'rgba(var(--pm-purple-rgb),0.2)' }}>
                  {String(item.day).padStart(2, '0')}
                </p>
                <div className="size-2 rounded-full" style={{ background: 'var(--pm-purple)', boxShadow: '0 0 8px var(--pm-purple)' }} />
                <div
                  className="flex-1 w-px"
                  style={{ background: 'linear-gradient(to bottom, rgba(var(--pm-purple-rgb),0.4), transparent)', minHeight: '30px' }}
                />
              </div>

              {/* Content */}
              <RevealOnScroll delay={i * 0.04} className="py-8 px-8 md:px-10">
                {item.tag && (
                  <p className="text-[0.6rem] tracking-[0.4em] uppercase font-medium mb-2" style={{ color: 'var(--pm-accent)' }}>
                    {item.tag}
                  </p>
                )}
                <p className="font-heading text-[1.4rem] md:text-[1.7rem] leading-tight text-white mb-2">{item.title}</p>
                {item.description && (
                  <p className="text-[0.9rem] leading-[1.8] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>
                    {item.description}
                  </p>
                )}
              </RevealOnScroll>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
