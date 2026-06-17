// Allow up to 30 s for the Neon DB to wake from cold/idle before timing out.
export const maxDuration = 30

import { DestinationStrip } from '@/components/blocks/DestinationStrip'
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

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const dest = typeof params.dest === 'string' ? params.dest.toLowerCase().trim() : ''

  const result = await getPublishedTrips(dest || undefined)
  const trips = result.status === 'ok' ? result.trips : []

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DestinationStrip />
        <TripsSection trips={trips} dest={dest} />
        <PackagesSection />
        <HowItWorks />
        <SilkSoiree />
        <Testimonials />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  )
}
