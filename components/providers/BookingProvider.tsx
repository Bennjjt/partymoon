'use client'

import { BookingModal } from '@/components/ui/BookingModal'
import { createContext, useContext, useState } from 'react'

export interface BookingTarget {
  tripId?: string     // Payload Trip document ID — absent for non-trip bookings (e.g. Silk Soiree)
  destination: string
  date: string
  basePrice: string
}

interface BookingContextValue {
  open: (target: BookingTarget) => void
  close: () => void
}

const BookingContext = createContext<BookingContextValue>({
  open: () => {},
  close: () => {},
})

export function useBooking() {
  return useContext(BookingContext)
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<BookingTarget | null>(null)

  return (
    <BookingContext.Provider value={{ open: setTarget, close: () => setTarget(null) }}>
      {children}
      {target && <BookingModal target={target} onClose={() => setTarget(null)} />}
    </BookingContext.Provider>
  )
}
