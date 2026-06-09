import { formatPrice } from '@/lib/data/trips'
import { TripReserveButton } from '@/components/blocks/TripReserveButton'

interface TripCTAProps {
  tripId: string
  destination: string
  date: string
  priceFrom: number
  deposit: number
}

export function TripCTA({ tripId, destination, date, priceFrom, deposit }: TripCTAProps) {
  return (
    <div
      className="relative overflow-hidden text-center py-36 px-6"
      style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(107,95,204,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(255,45,120,0.08) 0%, transparent 45%), var(--pm-midnight)',
        borderTop: '1px solid rgba(107,95,204,0.15)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Background destination name */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading whitespace-nowrap pointer-events-none select-none"
        style={{ fontSize: 'clamp(5rem, 16vw, 14rem)', color: 'rgba(107,95,204,0.04)', letterSpacing: '0.1em' }}
      >
        {destination.toUpperCase()}
      </span>

      <div className="relative">
        <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-6" style={{ color: '#FF2D78' }}>
          Don&rsquo;t Miss Out
        </p>

        <h2 className="font-heading font-light text-white leading-none mb-2" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
          GET YOUR SPOT
        </h2>
        <p className="font-heading font-light mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#FF2D78', lineHeight: 1, filter: 'drop-shadow(0 0 20px rgba(255,45,120,0.4))' }}>
          IN {destination.toUpperCase()}.
        </p>

        <p className="font-heading italic text-[1.2rem] mb-10 mx-auto max-w-sm" style={{ color: 'rgba(232,232,240,0.6)', lineHeight: 1.7 }}>
          Limited spaces per trip. Enquire now for availability.
        </p>

        {/* Price — single source of truth */}
        <p className="font-heading text-[2rem] text-white mb-1">
          {formatPrice(priceFrom)}
          <span className="font-sans text-[0.75rem] font-light text-white/40 ml-2">per person, from</span>
        </p>
        <p className="text-[0.65rem] tracking-[0.1em] text-white/30 mb-8">
          {formatPrice(deposit)} deposit secures your place
        </p>

        <div className="flex justify-center mb-6">
          <TripReserveButton
            tripId={tripId}
            destination={destination}
            date={date}
            priceFrom={formatPrice(priceFrom)}
          />
        </div>

        <p className="text-[0.65rem] tracking-[0.2em] uppercase font-light" style={{ color: 'rgba(157,78,221,0.4)' }}>
          Fully inclusive · Small group · Two dedicated hosts · Always VIP
        </p>
      </div>
    </div>
  )
}
