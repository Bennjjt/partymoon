import { MapPin } from 'lucide-react'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { TripSectionHeader } from '@/components/blocks/trip/TripSectionHeader'
import type { TripHotelOption } from '@/lib/data/trips'

interface TripHotelOptionsProps {
  hotelOptions: TripHotelOption[]
}

export function TripHotelOptions({ hotelOptions }: TripHotelOptionsProps) {
  if (!hotelOptions.length) return null

  return (
    <section style={{ background: 'var(--pm-deep)', position: 'relative', zIndex: 2 }}>
      <div className="px-6 md:px-12 py-24">
        <TripSectionHeader
          eyebrow="Where You Sleep"
          headline="THE HOTEL."
          sub="not just a room."
          description="Your Partymoon hotel is chosen for luxury, location, and spa access that genuinely delivers."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotelOptions.map((hotel, i) => (
            <RevealOnScroll key={hotel.id ?? i} delay={i * 0.08} className="h-full">
              <div
                className="h-full p-8 relative overflow-hidden transition-all duration-300 group"
                style={{ background: 'var(--pm-navy)', border: '1px solid rgba(var(--pm-purple-rgb),0.2)' }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: 'linear-gradient(to right, var(--pm-purple), var(--pm-gold-dim))' }}
                />

                {hotel.tier && (
                  <span
                    className="inline-block text-[0.55rem] tracking-[0.3em] uppercase px-3 py-1 rounded-full mb-4 font-medium"
                    style={{ background: 'rgba(var(--pm-purple-rgb),0.2)', color: 'var(--pm-purple-light)', border: '1px solid rgba(var(--pm-purple-rgb),0.3)' }}
                  >
                    {hotel.tier}
                  </span>
                )}

                <p className="font-heading text-[1.2rem] leading-tight text-white mb-1">{hotel.name}</p>

                {hotel.location && (
                  <p
                    className="text-[0.65rem] tracking-[0.2em] uppercase font-light mb-4 pb-4"
                    style={{ color: 'rgba(var(--pm-purple-rgb),0.5)', borderBottom: '1px solid rgba(var(--pm-purple-rgb),0.1)' }}
                  >
                    <MapPin size={10} className="inline-block mr-1 mb-0.5" strokeWidth={1.5} />{hotel.location}
                  </p>
                )}

                {hotel.features?.map((f, j) => (
                  <div key={j} className="flex items-start gap-3 mb-3">
                    <span
                      className="size-1 rounded-full flex-shrink-0 mt-2"
                      style={{ background: 'var(--pm-purple)', boxShadow: '0 0 4px var(--pm-purple)' }}
                    />
                    <span className="text-[0.85rem] font-light leading-snug" style={{ color: 'rgba(232,232,240,0.65)' }}>
                      {f.feature}
                    </span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
