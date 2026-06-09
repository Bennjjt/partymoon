import Image from 'next/image'
import type { CoverImage } from '@/lib/data/trips'
import { TripReserveButton } from '@/components/blocks/TripReserveButton'

interface TripHeroSectionProps {
  tripId: string
  destination: string
  date: string
  heroTagline?: string | null
  coverImage: CoverImage | null
  gradient: string
  priceFrom: string
}

export function TripHeroSection({
  tripId,
  destination,
  date,
  heroTagline,
  coverImage,
  gradient,
  priceFrom,
}: TripHeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        height: '100svh',
        maxHeight: '1000px',
        minHeight: '600px',
      }}
    >
      {/* ── Layer 1: Background ───────────────────────────────── */}
      {coverImage ? (
        <Image
          src={coverImage.url}
          alt={coverImage.alt || `${destination} — Partymoon VIP weekend`}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: gradient }} />
      )}

      {/* ── Layer 2: Overlay — controlled from theme.css ──────── */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--hero-overlay-gradient)' }}
      />

      {/* ── Layer 3: Content row pinned to bottom ─────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between gap-8 px-6 md:px-14 pb-12 md:pb-16"
      >
        {/* Left column: headline + CTA */}
        <div className="flex-shrink-0">
          <h1
            className="font-heading font-light text-white"
            style={{
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
              marginBottom: 'clamp(1.25rem, 2.5vw, 2rem)',
            }}
          >
            {destination}
          </h1>

          {/* Ghost CTA — text in primary colour */}
          <div id="book">
            <TripReserveButton
              tripId={tripId}
              destination={destination}
              date={date}
              priceFrom={priceFrom}
              variant="ghost"
            />
          </div>
        </div>

        {/* Right column: tagline — hidden on very small screens */}
        {heroTagline && (
          <p
            className="hidden sm:block font-sans font-normal text-right flex-shrink max-w-xs"
            style={{
              fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.75,
              letterSpacing: '0.01em',
            }}
          >
            {heroTagline}
          </p>
        )}
      </div>
    </section>
  )
}
