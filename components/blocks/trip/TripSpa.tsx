import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { TripSpa as TripSpaType } from '@/lib/data/trips'

interface TripSpaProps {
  spa: TripSpaType
}

export function TripSpa({ spa }: TripSpaProps) {
  if (!spa.heading && !spa.description) return null

  return (
    <section style={{ background: 'var(--pm-deep)', position: 'relative', zIndex: 2 }}>
      <div className="px-6 md:px-12 py-24">
        <RevealOnScroll>
          {spa.eyebrow && (
            <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: '#FF2D78' }}>{spa.eyebrow}</p>
          )}
          {spa.heading && (
            <h2 className="font-heading font-light text-white mb-1" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 0.95 }}>
              {spa.heading}
            </h2>
          )}
          {spa.subheading && (
            <p className="font-heading italic mb-3" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: 'var(--pm-purple-light)' }}>
              {spa.subheading}
            </p>
          )}
          <div className="w-16 h-[3px] mb-8" style={{ background: 'linear-gradient(to right, #FF2D78, var(--pm-purple))' }} />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div
            className="p-10 relative overflow-hidden"
            style={{ background: 'var(--pm-navy)', border: '1px solid rgba(107,95,204,0.2)' }}
          >
            {/* Decorative crescent */}
            <span className="absolute right-[-1rem] top-[-1rem] text-[12rem] leading-none pointer-events-none select-none" style={{ color: 'rgba(107,95,204,0.04)' }}>◑</span>

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
