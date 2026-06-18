import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { Trip } from '@/lib/data/trips'
import { TripGrid } from './TripGrid'

interface TripsSectionProps {
  trips: Trip[]
  dest: string
  svgPath?: string | null
  svgViewBox?: string | null
}

export function TripsSection({ trips, dest, svgPath, svgViewBox }: TripsSectionProps) {
  const showSvg = !!dest && !!svgPath && !!svgViewBox

  return (
    <section className="px-6 md:px-12 py-24" style={{ background: 'var(--pm-midnight)' }} id="trips">
      <RevealOnScroll className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[0.6rem] tracking-[0.35em] uppercase mb-3" style={{ color: 'var(--pm-purple-light)' }}>
            {dest ? `${dest.charAt(0).toUpperCase() + dest.slice(1)} weekends` : 'Upcoming weekends'}
          </p>
          <h2 className="font-heading font-light leading-[1.2]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', textWrap: 'balance' }}>
            Choose your <em className="italic">escape</em>
          </h2>
          <div className="w-16 h-[3px] mt-5" style={{ background: 'linear-gradient(to right, var(--pm-gold-dim), var(--pm-gold))' }} />
        </div>

        {showSvg ? (
          <svg
            viewBox={svgViewBox}
            aria-hidden="true"
            style={{ width: 'clamp(100px, 14vw, 180px)', height: 'clamp(100px, 14vw, 180px)', opacity: 0.72 }}
          >
            <path
              d={svgPath}
              fill="rgba(201,168,76,0.12)"
              stroke="#c9a84c"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <p className="text-[0.75rem] tracking-[0.08em] leading-[2] text-white/60 max-w-[300px]">
            25 guests maximum per trip. Once it&apos;s full, it&apos;s full.
          </p>
        )}
      </RevealOnScroll>

      <TripGrid trips={trips} />
    </section>
  )
}
