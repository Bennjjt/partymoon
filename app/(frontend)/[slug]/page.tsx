import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { GalleryVideo } from '@/components/ui/GalleryVideo'

// Trip section components
import { TripHeroSection }          from '@/components/blocks/trip/TripHeroSection'
import { TripTicker }               from '@/components/blocks/trip/TripTicker'
import { TripIntro }                from '@/components/blocks/trip/TripIntro'
import { TripInclusionsDetail, TripInclusionsSummary } from '@/components/blocks/trip/TripInclusions'
import { TripClubs }                from '@/components/blocks/trip/TripClubs'
import { TripHotelOptions }         from '@/components/blocks/trip/TripHotelOptions'
import { TripSignatureExperience }  from '@/components/blocks/trip/TripSignatureExperience'
import { TripSpa }                  from '@/components/blocks/trip/TripSpa'
import { TripDining }               from '@/components/blocks/trip/TripDining'
import { TripHosts }                from '@/components/blocks/trip/TripHosts'
import { TripCTA }                  from '@/components/blocks/trip/TripCTA'

import { getTripBySlug }            from '@/lib/queries/trips'
import { formatDateRange, formatPrice } from '@/lib/data/trips'
import { TripReserveButton }        from '@/components/blocks/TripReserveButton'

// TripMapLoader is 'use client' and owns ssr:false internally
import { TripMapLoader } from '@/components/blocks/TripMapLoader'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getTripBySlug(slug)
  if (result.status !== 'ok') return {}
  const { trip } = result
  return {
    title: trip.title,
    description: trip.heroTagline ?? `${trip.destination} — a Partymoon VIP weekend from ${formatPrice(trip.priceFrom)} per person.`,
  }
}

export default async function TripDetailPage({ params }: Props) {
  const { slug } = await params
  const result = await getTripBySlug(slug)

  if (result.status === 'not_found') notFound()

  if (result.status === 'degraded') {
    return (
      <>
        <Navbar variant="dark-scroll-hide" />
        <main>
          <TripPageSkeleton />
        </main>
        <Footer />
      </>
    )
  }

  const { trip } = result

  const dateLabel = formatDateRange(trip.startDate, trip.endDate)
  const spotsLeft = trip.spotsTotal - trip.spotsTaken
  const isSoldOut = spotsLeft <= 0
  const hasGallery = trip.gallery && trip.gallery.length > 0


  return (
    <>
      <Navbar variant="dark-scroll-hide" />
      <main>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <TripHeroSection
          tripId={trip.id}
          destination={trip.destination}
          date={dateLabel}
          heroTagline={trip.heroTagline}
          coverImage={trip.coverImage}
          gradient={trip.gradient}
          priceFrom={formatPrice(trip.priceFrom)}
        />

        {/* ── Ticker ─────────────────────────────────────────── */}
        <TripTicker destination={trip.destination} inclusions={trip.inclusions} />

        {/* ── Intro ──────────────────────────────────────────── */}
        {!!trip.introText && <TripIntro destination={trip.destination} introText={trip.introText} />}

        {/* ── Inclusions detail grid ─────────────────────────── */}
        {trip.inclusions?.length ? <TripInclusionsDetail inclusions={trip.inclusions} /> : null}

        {/* ── Itinerary ──────────────────────────────────────── */}
        {trip.itinerary && trip.itinerary.length > 0 && (
          <section
            style={{
              background: 'var(--pm-deep)',
              borderTop: '1px solid rgba(107,95,204,0.15)',
              borderBottom: '1px solid rgba(107,95,204,0.15)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div className="px-6 md:px-12 py-24">
              <RevealOnScroll>
                <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: '#FF2D78' }}>Hour by Hour</p>
                <h2 className="font-heading font-light text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.95 }}>
                  YOUR WEEKEND.<br /><em className="italic" style={{ color: 'var(--pm-purple-light)', fontSize: '0.75em' }}>laid out.</em>
                </h2>
                <div className="w-16 h-[3px] mb-10" style={{ background: 'linear-gradient(to right, #FF2D78, var(--pm-purple))' }} />
              </RevealOnScroll>

              <ol className="space-y-0">
                {trip.itinerary.map((item, i) => (
                  <li
                    key={item.id ?? item.day}
                    className="grid"
                    style={{ gridTemplateColumns: '110px 1fr', borderBottom: i < trip.itinerary!.length - 1 ? '1px solid rgba(107,95,204,0.1)' : 'none' }}
                  >
                    {/* Left */}
                    <div className="flex flex-col items-center gap-2 py-8 px-4" style={{ borderRight: '1px solid rgba(107,95,204,0.15)' }}>
                      <p className="font-heading text-[2.5rem] leading-none" style={{ color: 'rgba(107,95,204,0.2)' }}>
                        {String(item.day).padStart(2, '0')}
                      </p>
                      <div className="size-2 rounded-full" style={{ background: 'var(--pm-purple)', boxShadow: '0 0 8px var(--pm-purple)' }} />
                      <div className="flex-1 w-px" style={{ background: 'linear-gradient(to bottom, rgba(107,95,204,0.4), transparent)', minHeight: '30px' }} />
                    </div>
                    {/* Right */}
                    <RevealOnScroll delay={i * 0.04} className="py-8 px-8 md:px-10">
                      {item.tag && (
                        <p className="text-[0.6rem] tracking-[0.4em] uppercase font-medium mb-2" style={{ color: '#FF2D78' }}>{item.tag}</p>
                      )}
                      <p className="font-heading text-[1.4rem] md:text-[1.7rem] leading-tight text-white mb-2">{item.title}</p>
                      {item.description && (
                        <p className="text-[0.9rem] leading-[1.8] font-light" style={{ color: 'rgba(232,232,240,0.55)' }}>{item.description}</p>
                      )}
                    </RevealOnScroll>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* ── Clubs ──────────────────────────────────────────── */}
        {trip.clubs?.length ? <TripClubs clubs={trip.clubs} /> : null}

        {/* ── Hotel options ───────────────────────────────────── */}
        {trip.hotelOptions?.length ? <TripHotelOptions hotelOptions={trip.hotelOptions} /> : null}

        {/* ── Signature experience ────────────────────────────── */}
        {trip.signatureExperience && <TripSignatureExperience experience={trip.signatureExperience} />}

        {/* ── Spa ────────────────────────────────────────────── */}
        {trip.spa && <TripSpa spa={trip.spa} />}

        {/* ── Dining ─────────────────────────────────────────── */}
        {trip.diningExperiences?.length ? <TripDining diningExperiences={trip.diningExperiences} /> : null}

        {/* ── Hosts ──────────────────────────────────────────── */}
        {trip.hosts?.length ? <TripHosts hosts={trip.hosts} /> : null}

        {/* ── Inclusions icon summary ─────────────────────────── */}
        {trip.inclusions?.length ? <TripInclusionsSummary inclusions={trip.inclusions} /> : null}

        {/* ── Map ─────────────────────────────────────────────── */}
        {trip.showMap && trip.latitude && trip.longitude && (
          <TripMapLoader latitude={trip.latitude} longitude={trip.longitude} destination={trip.destination} />
        )}

        {/* ── Gallery ─────────────────────────────────────────── */}
        {hasGallery && (
          <section className="border-t px-6 md:px-12 py-16" style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}>
            <div className="">
              <RevealOnScroll>
                <p className="text-[0.6rem] tracking-[0.35em] uppercase mb-3" style={{ color: 'var(--pm-purple-light)' }}>Photography</p>
                <h2 className="font-heading text-[1.8rem] font-light text-white mb-10">
                  {trip.destination} in pictures
                </h2>
              </RevealOnScroll>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {trip.gallery!.map((item, i) => (
                  <RevealOnScroll key={item.id ?? i} delay={i * 0.06}>
                    <div className="group">
                      <div className="relative overflow-hidden rounded-[2px] bg-pm-deep" style={{ aspectRatio: '3 / 2' }}>
                        {item.videoUrl ? (
                          <GalleryVideo src={item.videoUrl} gradient={trip.gradient} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                        ) : item.image ? (
                          <Image src={item.image.url} alt={item.image.alt || `${trip.destination} — Partymoon`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        ) : null}
                      </div>
                      {item.caption && <p className="text-[0.65rem] tracking-[0.05em] text-white/35 mt-2">{item.caption}</p>}
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Booking sidebar (fallback for trips without the new content) ── */}
        {!trip.inclusions?.length && (
          <div className="px-6 md:px-12 py-16 ">
            <div className="grid gap-16 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {!!trip.summary && (
                  <section>
                    <h2 className="font-heading text-[1.6rem] font-light text-white mb-4">About this weekend</h2>
                    <p className="text-[0.875rem] leading-[1.95] text-white/60">{typeof trip.summary === 'string' ? trip.summary : ''}</p>
                  </section>
                )}
              </div>
              <aside>
                <div className="rounded-[2px] p-6 border sticky top-24" style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}>
                  <p className="font-heading text-[2.2rem] text-white leading-none mb-1">{formatPrice(trip.priceFrom)}</p>
                  <p className="text-[0.65rem] tracking-[0.1em] text-white/40 mb-6">per person, from</p>
                  <div className="mb-6">
                    <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.round((trip.spotsTaken / trip.spotsTotal) * 100)}%`, background: isSoldOut ? '#f09595' : 'var(--pm-purple)' }} />
                    </div>
                    <p className="text-[0.6rem] text-white/30 mt-2">{trip.spotsTaken} of {trip.spotsTotal} taken</p>
                  </div>
                  {isSoldOut
                    ? <a href="/#waitlist" className="block w-full text-center text-[0.65rem] tracking-[0.2em] uppercase py-3 border text-white rounded-[2px]" style={{ borderColor: 'var(--pm-glass-border)' }}>Join the waitlist</a>
                    : <TripReserveButton tripId={trip.id} destination={trip.destination} date={dateLabel} priceFrom={formatPrice(trip.priceFrom)} />
                  }
                  <p className="text-[0.6rem] text-white/25 mt-4 text-center">£{trip.deposit} deposit · balance 8 weeks before travel</p>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────── */}
        <TripCTA
          tripId={trip.id}
          destination={trip.destination}
          date={dateLabel}
          priceFrom={trip.priceFrom}
          deposit={trip.deposit}
        />

      </main>
      <Footer />
    </>
  )
}

// ── Degraded state: shown when CMS is unreachable ────────────────

function TripPageSkeleton() {
  return (
    <>
      {/* Hero skeleton */}
      <div
        className="relative flex items-end min-h-[85vh] px-6 md:px-12 pb-16 animate-pulse"
        style={{ background: 'linear-gradient(160deg,#1a1535 0%,#0d1a35 50%,#0d0d28 100%)' }}
      >
        <div className="w-full max-w-2xl space-y-4">
          <div className="h-3 w-24 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-14 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-5 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex gap-3 pt-4">
            <div className="h-12 w-36 rounded-[2px]" style={{ background: 'rgba(107,95,204,0.3)' }} />
            <div className="h-12 w-36 rounded-[2px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </div>
      </div>

      {/* Body skeleton */}
      <div className="px-6 md:px-12 py-24 space-y-6 animate-pulse" style={{ background: 'var(--pm-deep)' }}>
        <div className="h-3 w-32 rounded" style={{ background: 'var(--pm-glass)' }} />
        <div className="h-8 w-64 rounded" style={{ background: 'var(--pm-glass)' }} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-[2px]" style={{ background: 'var(--pm-glass)' }} />
          ))}
        </div>

        {/* Degraded notice */}
        <div
          className="mt-12 rounded-[2px] border p-8 text-center"
          style={{ borderColor: 'rgba(107,95,204,0.25)', background: 'rgba(107,95,204,0.05)' }}
        >
          <p className="text-[0.6rem] tracking-[0.35em] uppercase mb-3" style={{ color: 'var(--pm-purple-light)' }}>
            Content loading
          </p>
          <p className="font-heading text-white text-[1.5rem] font-light mb-3">
            Trip details are on their way
          </p>
          <p className="text-[0.8rem] text-white/50 mb-6 max-w-sm mx-auto leading-relaxed">
            We&apos;re having trouble reaching our content server right now. Please try refreshing in a moment.
          </p>
          <a
            href="/"
            className="inline-block text-[0.65rem] tracking-[0.2em] uppercase px-8 py-3 border text-white rounded-[2px] transition-colors hover:border-white/40"
            style={{ borderColor: 'var(--pm-glass-border)' }}
          >
            View all trips
          </a>
        </div>
      </div>
    </>
  )
}
