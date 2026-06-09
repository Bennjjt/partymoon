import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { Trip } from '@/lib/data/trips'
import { TripGrid } from './TripGrid'

interface TripsSectionProps {
  trips: Trip[]
  dest: string
  degraded?: boolean
}

export function TripsSection({ trips, dest, degraded }: TripsSectionProps) {
  return (
    <section className="px-6 md:px-12 py-24" style={{ background: 'var(--pm-midnight)' }} id="trips">
      <RevealOnScroll className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[0.6rem] tracking-[0.35em] uppercase mb-3" style={{ color: 'var(--pm-purple-light)' }}>
            {dest ? `${dest.charAt(0).toUpperCase() + dest.slice(1)} weekends` : 'Upcoming weekends'}
          </p>
          <h2 className="font-heading font-light leading-[1.2]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Choose your <em className="italic">escape</em>
          </h2>
        </div>
        <p className="text-[0.75rem] tracking-[0.08em] leading-[2] text-white/60 max-w-[300px]">
          25 guests maximum per trip. Once it&apos;s full, it&apos;s full.
        </p>
      </RevealOnScroll>

      {degraded ? <TripGridSkeleton /> : <TripGrid trips={trips} />}
    </section>
  )
}

function TripGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border rounded-[2px] overflow-hidden animate-pulse"
          style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}
        >
          <div className="h-[220px]" style={{ background: 'var(--pm-glass)' }} />
          <div className="p-6 space-y-4">
            <div className="h-3 w-40 rounded" style={{ background: 'var(--pm-glass)' }} />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1">
                  <div className="h-2 w-10 rounded" style={{ background: 'var(--pm-glass)' }} />
                  <div className="h-3 w-20 rounded" style={{ background: 'var(--pm-glass)' }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t" style={{ borderColor: 'var(--pm-glass-border)' }}>
              <div className="h-6 w-20 rounded" style={{ background: 'var(--pm-glass)' }} />
              <div className="h-4 w-16 rounded" style={{ background: 'var(--pm-glass)' }} />
            </div>
            <div className="flex gap-2 mt-2">
              <div className="flex-1 h-9 rounded-[2px]" style={{ background: 'var(--pm-glass)' }} />
              <div className="flex-1 h-9 rounded-[2px]" style={{ background: 'var(--pm-glass)' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
