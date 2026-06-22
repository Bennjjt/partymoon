// Allow up to 30 s for the Neon DB to wake from cold/idle before timing out.
export const maxDuration = 30

import { draftMode } from 'next/headers'
import { DestinationStrip, type DestinationOption } from '@/components/blocks/DestinationStrip'
import { Hero } from '@/components/blocks/Hero'
import { HowItWorks } from '@/components/blocks/HowItWorks'
import { PackagesSection } from '@/components/blocks/PackagesSection'
import { SilkSoiree } from '@/components/blocks/SilkSoiree'
import { Testimonials } from '@/components/blocks/Testimonials'
import { TripsSection } from '@/components/blocks/TripsSection'
import { WaitlistSection } from '@/components/blocks/WaitlistSection'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { getPublishedTrips } from '@/lib/queries/trips'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const MONTH_FMT = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' })

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const dest = typeof params.dest === 'string' ? params.dest.toLowerCase().trim() : ''

  // Fetch all trips (unfiltered) to build the destination list, then fetch
  // filtered trips for the grid separately if a dest filter is active.
  const { isEnabled: preview } = await draftMode()
  const allResult = await getPublishedTrips(undefined, preview)
  const allTrips = allResult.status === 'ok' ? allResult.trips : []

  const trips = dest
    ? allTrips.filter((t) => t.slug.toLowerCase() === dest || t.destination.toLowerCase() === dest)
    : allTrips

  // One entry per unique slug, ordered by startDate, season from trip date.
  const seen = new Set<string>()
  const destinations: DestinationOption[] = []
  for (const trip of allTrips) {
    if (seen.has(trip.slug)) continue
    seen.add(trip.slug)
    destinations.push({
      label: trip.destination,
      value: trip.slug,
      season: MONTH_FMT.format(new Date(trip.startDate)),
      svgPath: trip.regionSvgPath ?? null,
      svgViewBox: trip.regionSvgViewBox ?? null,
    })
  }

  const activeDest = destinations.find((d) => d.value === dest)

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DestinationStrip destinations={destinations} />
        <TripsSection
          trips={trips}
          dest={dest}
          svgPath={activeDest?.svgPath}
          svgViewBox={activeDest?.svgViewBox}
        />
        <PackagesSection />
        <HowItWorks />
        <SilkSoiree />
        <Testimonials />
        <WaitlistSection destinations={destinations} />
      </main>
      <Footer />
    </>
  )
}
