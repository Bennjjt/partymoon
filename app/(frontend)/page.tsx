// Allow up to 30 s for the Neon DB to wake from cold/idle before timing out.
export const maxDuration = 30

import { Suspense } from 'react'
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
  const degraded = result.status === 'degraded'

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<DestinationStripSkeleton />}>
          <DestinationStrip />
        </Suspense>
        <TripsSection trips={trips} dest={dest} degraded={degraded} />
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

function DestinationStripSkeleton() {
  return (
    <div className="border-y px-6 md:px-12 py-8" style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}>
      <div className="flex gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-9 rounded-[2px] animate-pulse" style={{ width: i === 0 ? 96 : 80, background: 'var(--pm-glass)' }} />
        ))}
      </div>
    </div>
  )
}
