import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { TripSectionHeader } from '@/components/blocks/trip/TripSectionHeader'
import { SectionBg } from '@/components/blocks/trip/SectionBg'
import type { TripSpa as TripSpaType, CoverImage } from '@/lib/data/trips'

interface TripSpaProps {
  spa: TripSpaType
  bgImage?: CoverImage | null
}

export function TripSpa({ spa, bgImage }: TripSpaProps) {
  if (!spa.heading && !spa.description) return null

  return (
    <section style={{ background: bgImage ? 'transparent' : 'var(--pm-deep)', position: 'relative', overflow: 'hidden', zIndex: 2 }}>
      <SectionBg bgImage={bgImage} />
      <div className="px-6 md:px-12 py-24 relative" style={{ zIndex: 1 }}>
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
                      style={{ background: 'var(--pm-purple)' }}
                    />
                    <span className="text-[0.9rem] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>{f.feature}</span>
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
