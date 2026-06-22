export const maxDuration = 30

import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

// Trip section components
import { TripHeroSection }          from '@/components/blocks/trip/TripHeroSection'
import { TripTicker }               from '@/components/blocks/trip/TripTicker'
import { TripIntro }                from '@/components/blocks/trip/TripIntro'
import { TripInclusionsDetail, TripInclusionsSummary } from '@/components/blocks/trip/TripInclusions'
import { TripItinerary }            from '@/components/blocks/trip/TripItinerary'
import { TripClubs }                from '@/components/blocks/trip/TripClubs'
import { TripHotelOptions }         from '@/components/blocks/trip/TripHotelOptions'
import { TripSignatureExperience }  from '@/components/blocks/trip/TripSignatureExperience'
import { TripSpa }                  from '@/components/blocks/trip/TripSpa'
import { TripDining }               from '@/components/blocks/trip/TripDining'
import { TripHosts }                from '@/components/blocks/trip/TripHosts'
import { TripGallery }              from '@/components/blocks/trip/TripGallery'
import { TripBookingSidebar }       from '@/components/blocks/trip/TripBookingSidebar'
import { TripCTA }                  from '@/components/blocks/trip/TripCTA'

import { getTripBySlug }            from '@/lib/queries/trips'
import { formatDateRange, formatPrice } from '@/lib/data/trips'

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
  const { isEnabled: preview } = await draftMode()
  const result = await getTripBySlug(slug, preview)

  if (result.status !== 'ok') notFound()

  const { trip } = result
  const dateLabel = formatDateRange(trip.startDate, trip.endDate)

  return (
    <>
      <Navbar variant="dark-scroll-hide" />
      <main>

        <TripHeroSection
          destination={trip.destination}
          date={dateLabel}
          heroTagline={trip.heroTagline}
          coverImage={trip.coverImage}
          gradient={trip.gradient}
          priceFrom={formatPrice(trip.priceFrom)}
          regionSvgPath={trip.regionSvgPath}
          regionSvgViewBox={trip.regionSvgViewBox}
        />

        <TripTicker destination={trip.destination} inclusions={trip.inclusions} />

        {!!trip.introText && (
          <TripIntro
            destination={trip.destination}
            introText={trip.introText}
            introImages={trip.introImages}
            coverImage={trip.coverImage}
            gallery={trip.gallery}
          />
        )}

        {trip.inclusions?.length ? <TripInclusionsDetail inclusions={trip.inclusions} bgImage={trip.inclusionsBgImage} /> : null}

        {trip.itinerary?.length ? <TripItinerary itinerary={trip.itinerary} bgImage={trip.itineraryBgImage} /> : null}

        {trip.clubs?.length ? <TripClubs clubs={trip.clubs} bgImage={trip.clubsBgImage} /> : null}

        {trip.hotelOptions?.length ? <TripHotelOptions hotelOptions={trip.hotelOptions} bgImage={trip.hotelOptionsBgImage} /> : null}

        {trip.signatureExperience && <TripSignatureExperience experience={trip.signatureExperience} bgImage={trip.signatureExperienceBgImage} />}

        {trip.spa && <TripSpa spa={trip.spa} bgImage={trip.spaBgImage} />}

        {trip.diningExperiences?.length ? <TripDining diningExperiences={trip.diningExperiences} bgImage={trip.diningBgImage} /> : null}

        {trip.hosts?.length ? <TripHosts hosts={trip.hosts} bgImage={trip.hostsBgImage} /> : null}

        {trip.inclusions?.length ? <TripInclusionsSummary inclusions={trip.inclusions} /> : null}

        {trip.showMap && trip.latitude && trip.longitude && (
          <TripMapLoader latitude={trip.latitude} longitude={trip.longitude} destination={trip.destination} />
        )}

        {trip.gallery?.length ? (
          <TripGallery destination={trip.destination} gallery={trip.gallery} gradient={trip.gradient} />
        ) : null}

        {!trip.inclusions?.length && (
          <TripBookingSidebar trip={trip} />
        )}

        <TripCTA
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
