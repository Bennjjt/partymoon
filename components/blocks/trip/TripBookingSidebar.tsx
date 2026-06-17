import { PortableText } from 'next-sanity'
import { TripReserveButton } from '@/components/blocks/TripReserveButton'
import { formatPrice } from '@/lib/data/trips'
import type { Trip } from '@/lib/data/trips'

interface TripBookingSidebarProps {
  trip: Pick<Trip, 'id' | 'destination' | 'priceFrom' | 'deposit' | 'spotsTotal' | 'spotsTaken' | 'summary'>
  dateLabel: string
}

export function TripBookingSidebar({ trip, dateLabel }: TripBookingSidebarProps) {
  const spotsLeft = trip.spotsTotal - trip.spotsTaken
  const isSoldOut = spotsLeft <= 0
  const fillPct = Math.round((trip.spotsTaken / trip.spotsTotal) * 100)

  return (
    <div className="px-6 md:px-12 py-16">
      <div className="grid gap-16 lg:grid-cols-3">
        {/* Summary prose */}
        <div className="lg:col-span-2">
          {!!trip.summary?.length && (
            <section>
              <h2 className="font-heading text-[1.6rem] font-light text-white mb-4">About this weekend</h2>
              <div className="text-[0.875rem] leading-[1.95] text-white/60 space-y-3">
                <PortableText value={trip.summary} />
              </div>
            </section>
          )}
        </div>

        {/* Booking card */}
        <aside>
          <div
            className="rounded-[2px] p-6 border sticky top-24"
            style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}
          >
            <p className="font-heading text-[2.2rem] text-white leading-none mb-1">
              {formatPrice(trip.priceFrom)}
            </p>
            <p className="text-[0.65rem] tracking-[0.1em] text-white/40 mb-6">per person, from</p>

            {/* Availability bar */}
            <div className="mb-6">
              <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${fillPct}%`,
                    background: isSoldOut ? 'rgba(255,120,120,0.9)' : 'var(--pm-purple)',
                  }}
                />
              </div>
              <p className="text-[0.6rem] text-white/40 mt-2">
                {trip.spotsTaken} of {trip.spotsTotal} taken
              </p>
            </div>

            {isSoldOut ? (
              <a
                href="/#waitlist"
                className="block w-full text-center text-[0.65rem] tracking-[0.2em] uppercase py-3 border text-white rounded-[2px]"
                style={{ borderColor: 'var(--pm-glass-border)' }}
              >
                Join the waitlist
              </a>
            ) : (
              <TripReserveButton
                tripId={trip.id}
                destination={trip.destination}
                date={dateLabel}
                priceFrom={formatPrice(trip.priceFrom)}
              />
            )}

            <p className="text-[0.6rem] text-white/40 mt-4 text-center">
              £{trip.deposit} deposit · balance 8 weeks before travel
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
