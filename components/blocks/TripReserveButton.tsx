'use client'

import { useBooking } from '@/components/providers/BookingProvider'

interface Props {
  tripId: string
  destination: string
  date: string
  priceFrom: string
  /** solid — filled purple button (default, used in TripCTA)
   *  ghost — transparent bg, primary-colour text and border (used in hero) */
  variant?: 'solid' | 'ghost'
}

export function TripReserveButton({ tripId, destination, date, priceFrom, variant = 'solid' }: Props) {
  const { open } = useBooking()

  const isSolid = variant === 'solid'

  return (
    <button
      onClick={() => open({ tripId, destination, date, basePrice: priceFrom })}
      className="text-[0.65rem] tracking-[0.2em] uppercase px-8 py-3 rounded-[2px] border transition-colors font-medium"
      style={{
        background:   isSolid ? 'var(--pm-purple)' : 'transparent',
        borderColor:  'var(--pm-purple)',
        color:        isSolid ? 'var(--pm-midnight)' : 'var(--pm-purple)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background  = isSolid ? 'transparent' : 'var(--pm-purple)'
        e.currentTarget.style.color       = isSolid ? 'var(--pm-purple)' : 'var(--pm-midnight)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background  = isSolid ? 'var(--pm-purple)' : 'transparent'
        e.currentTarget.style.color       = isSolid ? 'var(--pm-midnight)' : 'var(--pm-purple)'
      }}
    >
      {isSolid ? 'Reserve your place' : 'Secure your spot'}
    </button>
  )
}
