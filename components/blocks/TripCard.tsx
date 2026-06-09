'use client'

import { useBooking } from '@/components/providers/BookingProvider'
import {
  type CoverImage,
  type Trip,
  formatDateRange,
  formatPrice,
  getTripAvailability,
} from '@/lib/data/trips'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const IMAGE_SIZES = '(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw'

export function TripCard({ trip }: { trip: Trip }) {
  const { open } = useBooking()
  const availability = getTripAvailability(trip)
  const isSoldOut = availability === 'sold-out'
  const spotsLeft = trip.spotsTotal - trip.spotsTaken
  const spotsPercent = Math.round((trip.spotsTaken / trip.spotsTotal) * 100)
  const dateLabel = formatDateRange(trip.startDate, trip.endDate)
  const priceLabel = formatPrice(trip.priceFrom)

  const handleBook = () => {
    if (!isSoldOut) {
      open({
        tripId: trip.id,
        destination: trip.destination,
        date: dateLabel,
        basePrice: priceLabel,
      })
    }
  }

  return (
    <motion.article
      className="border rounded-[2px] overflow-hidden"
      style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}
      whileHover={isSoldOut ? {} : { y: -4, borderColor: 'var(--pm-purple)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Image area */}
      {trip.coverImage ? (
        <PhotoArea image={trip.coverImage} destination={trip.destination} isSoldOut={isSoldOut} spotsLeft={spotsLeft} slug={trip.slug} />
      ) : (
        <FallbackArea gradient={trip.gradient} destination={trip.destination} isSoldOut={isSoldOut} spotsLeft={spotsLeft} slug={trip.slug} />
      )}

      {/* Body */}
      <div className="p-6">
        <p className="text-[0.65rem] tracking-[0.15em] uppercase mb-4" style={{ color: 'var(--pm-purple-light)' }}>
          {dateLabel}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <Detail label="Hotel"       value={trip.hotel      ?? '—'} />
          <Detail label="Nights"      value={trip.clubNights ?? '—'} />
          <Detail label="Includes"    value={trip.includes   ?? '—'} />
          <Detail label="Group size"  value={`${trip.spotsTotal} guests`} />
        </div>

        {/* Price + availability */}
        <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: 'var(--pm-glass-border)' }}>
          <p className="font-heading text-2xl text-white leading-none">
            {priceLabel}{' '}
            <span className="font-sans text-[0.65rem] font-light text-white/50">per person from</span>
          </p>
          <div className="text-right">
            <p className="text-[0.6rem] tracking-[0.1em] text-white/50 mb-1">
              {trip.spotsTaken} of {trip.spotsTotal} taken
            </p>
            <div className="w-20 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full" style={{ width: `${spotsPercent}%`, background: 'var(--pm-purple)' }} />
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-2 mt-4">
          <Link
            href={`/${trip.slug}`}
            className="flex-1 text-center text-[0.6rem] tracking-[0.2em] uppercase py-3 border text-white rounded-[2px] transition-colors hover:border-white/40"
            style={{ borderColor: 'var(--pm-glass-border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            Learn more
          </Link>

          {isSoldOut ? (
            <a
              href="#waitlist"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center text-[0.6rem] tracking-[0.2em] uppercase py-3 border text-white rounded-[2px] transition-colors hover:border-white/40"
              style={{ borderColor: 'var(--pm-glass-border)' }}
            >
              Join waitlist
            </a>
          ) : (
            <button
              onClick={handleBook}
              className="flex-1 text-center text-[0.6rem] tracking-[0.2em] uppercase py-3 rounded-[2px] border transition-colors"
              style={{ background: 'var(--pm-purple)', borderColor: 'var(--pm-purple)', color: 'var(--pm-midnight)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--pm-purple)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--pm-purple)'
                e.currentTarget.style.color = 'var(--pm-midnight)'
              }}
            >
              Reserve
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/* ── Image sub-components ─────────────────────────────────────── */

interface AreaProps {
  destination: string
  isSoldOut: boolean
  spotsLeft: number
  slug: string
}

function PhotoArea({ image, destination, isSoldOut, spotsLeft, slug }: AreaProps & { image: CoverImage }) {
  return (
    <Link href={`/${slug}`} className="block relative h-[220px]">
      <Image
        src={image.url}
        alt={image.alt || `${destination} — Partymoon VIP group travel`}
        fill
        className="object-cover"
        sizes={IMAGE_SIZES}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 55%)' }} />
      <DestLabel destination={destination} />
      <SpotsBadge isSoldOut={isSoldOut} spotsLeft={spotsLeft} />
    </Link>
  )
}

function FallbackArea({ gradient, destination, isSoldOut, spotsLeft, slug }: AreaProps & { gradient: string }) {
  return (
    <Link href={`/${slug}`} className="block relative h-[220px]" style={{ background: gradient }}>
      <DestLabel destination={destination} />
      <SpotsBadge isSoldOut={isSoldOut} spotsLeft={spotsLeft} />
    </Link>
  )
}

function DestLabel({ destination }: { destination: string }) {
  return (
    <span className="absolute bottom-6 left-6 z-10 font-heading text-[2rem] font-normal tracking-[0.05em] text-white">
      {destination}
    </span>
  )
}

function SpotsBadge({ isSoldOut, spotsLeft }: { isSoldOut: boolean; spotsLeft: number }) {
  return (
    <div
      className="absolute top-4 right-4 z-10 text-[0.6rem] tracking-[0.15em] uppercase px-3 py-[0.4rem] rounded-[2px]"
      style={isSoldOut
        ? { background: 'rgba(80,20,20,0.8)', color: '#f09595' }
        : { background: 'rgba(var(--pm-purple-rgb),0.8)', color: '#fff' }}
    >
      {isSoldOut ? 'Sold out' : `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left`}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.6rem] tracking-[0.15em] uppercase text-white/40 mb-1">{label}</p>
      <p className="text-[0.75rem] text-white">{value}</p>
    </div>
  )
}
