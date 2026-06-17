import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { TripSectionHeader } from '@/components/blocks/trip/TripSectionHeader'
import type { TripSpa as TripSpaType } from '@/lib/data/trips'

interface TripSpaProps {
  spa: TripSpaType
}

export function TripSpa({ spa }: TripSpaProps) {
  if (!spa.heading && !spa.description) return null

  return (
    <section style={{ background: 'var(--pm-deep)', position: 'relative', zIndex: 2 }}>
      <div className="px-6 md:px-12 py-24">
        <TripSectionHeader
          eyebrow={spa.eyebrow ?? ''}
          headline={spa.heading ?? ''}
          subheading={spa.subheading ?? undefined}
          dividerClass="mb-8"
        />

        <RevealOnScroll delay={0.1}>
          <div
            className="p-10 relative overflow-hidden"
            style={{ background: 'var(--pm-navy)', border: '1px solid rgba(var(--pm-purple-rgb),0.2)' }}
          >
            {/* Decorative crescent */}
            <span
              className="absolute right-[-1rem] top-[-1rem] text-[12rem] leading-none pointer-events-none select-none"
              style={{ color: 'rgba(var(--pm-purple-rgb),0.04)' }}
            >
              ◑
            </span>

            {spa.description && (
              <p className="text-[0.95rem] leading-[2] font-light max-w-2xl mb-8" style={{ color: 'rgba(232,232,240,0.65)' }}>
                {spa.description}
              </p>
            )}

            {spa.features && spa.features.length > 0 && (
              <div className="space-y-3">
                {spa.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="size-1 rounded-full flex-shrink-0 mt-2.5"
                      style={{ background: 'var(--pm-purple)', boxShadow: '0 0 4px var(--pm-purple)' }}
                    />
                    <span className="text-[0.9rem] font-light" style={{ color: 'rgba(232,232,240,0.6)' }}>{f.feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
