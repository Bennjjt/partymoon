import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { TripHotelOption } from '@/lib/data/trips'

interface TripHotelOptionsProps {
  hotelOptions: TripHotelOption[]
}

export function TripHotelOptions({ hotelOptions }: TripHotelOptionsProps) {
  if (!hotelOptions.length) return null

  return (
    <section style={{ background: 'var(--pm-deep)', position: 'relative', zIndex: 2 }}>
      <div className="px-6 md:px-12 py-24">
        <RevealOnScroll>
          <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: '#FF2D78' }}>Where You Sleep</p>
          <h2 className="font-heading font-light text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.95 }}>
            THE HOTEL.<br />
            <em className="italic" style={{ color: 'var(--pm-purple-light)', fontSize: '0.75em' }}>not just a room.</em>
          </h2>
          <div className="w-16 h-[3px] mb-6" style={{ background: 'linear-gradient(to right, #FF2D78, var(--pm-purple))' }} />
          <p className="text-[0.9rem] leading-[1.9] font-light max-w-xl mb-10" style={{ color: 'rgba(232,232,240,0.6)' }}>
            Your Partymoon hotel is chosen for luxury, location, and spa access that genuinely delivers.
          </p>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotelOptions.map((hotel, i) => (
            <RevealOnScroll key={hotel.id ?? i} delay={i * 0.08}>
              <div
                className="p-8 relative overflow-hidden transition-all duration-300 group"
                style={{ background: 'var(--pm-navy)', border: '1px solid rgba(107,95,204,0.2)' }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: 'linear-gradient(to right, var(--pm-purple), #FF2D78)' }}
                />

                {hotel.tier && (
                  <span
                    className="inline-block text-[0.55rem] tracking-[0.3em] uppercase px-3 py-1 rounded-full mb-4 font-medium"
                    style={{ background: 'rgba(107,95,204,0.2)', color: 'var(--pm-purple-light)', border: '1px solid rgba(107,95,204,0.3)' }}
                  >
                    {hotel.tier}
                  </span>
                )}

                <p className="font-heading text-[1.2rem] leading-tight text-white mb-1">{hotel.name}</p>

                {hotel.location && (
                  <p
                    className="text-[0.65rem] tracking-[0.2em] uppercase font-light mb-4 pb-4"
                    style={{ color: 'rgba(157,78,221,0.5)', borderBottom: '1px solid rgba(107,95,204,0.1)' }}
                  >
                    📍 {hotel.location}
                  </p>
                )}

                {hotel.features?.map((f, j) => (
                  <div key={j} className="flex items-start gap-3 mb-3">
                    <span
                      className="size-1 rounded-full flex-shrink-0 mt-2"
                      style={{ background: 'var(--pm-purple)', boxShadow: '0 0 4px var(--pm-purple)' }}
                    />
                    <span className="text-[0.85rem] font-light leading-snug" style={{ color: 'rgba(232,232,240,0.55)' }}>
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
