import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { TripSectionHeader } from '@/components/blocks/trip/TripSectionHeader'
import { TripIcon } from '@/components/ui/TripIcon'
import type { TripInclusion } from '@/lib/data/trips'

interface TripInclusionsProps {
  inclusions: TripInclusion[]
}

/** Full detail grid — "What's In It" */
export function TripInclusionsDetail({ inclusions }: TripInclusionsProps) {
  if (!inclusions.length) return null
  return (
    <section style={{ background: 'var(--pm-midnight)', position: 'relative', zIndex: 2 }}>
      <div className="px-6 md:px-12 py-24">
        <TripSectionHeader eyebrow="The Full Package" headline="EVERYTHING." sub="included." />

        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1px',
            background: 'rgba(var(--pm-purple-rgb),0.15)',
            border: '1px solid rgba(var(--pm-purple-rgb),0.15)',
          }}
        >
          {inclusions.map((item, i) => (
            <RevealOnScroll key={item.id ?? i} delay={i * 0.05} className="h-full">
              <div
                className="h-full p-9 relative overflow-hidden transition-colors duration-300 group"
                style={{ background: 'var(--pm-deep)' }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: 'linear-gradient(to right, var(--pm-purple), var(--pm-gold-dim))' }}
                />
                {item.icon && (
                  <div className="mb-4" style={{ color: 'var(--pm-purple)' }}>
                    <TripIcon name={item.icon} size={28} strokeWidth={1.5} />
                  </div>
                )}
                <p className="font-heading text-[1.1rem] text-white mb-2 leading-tight">{item.title}</p>
                {item.detail ? (
                  <p className="text-[0.85rem] leading-[1.75] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>
                    {item.detail}
                  </p>
                ) : item.sub ? (
                  <p className="text-[0.85rem] leading-[1.75] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>
                    {item.sub}
                  </p>
                ) : null}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Icon summary grid — "All In, No Surprises" */
export function TripInclusionsSummary({ inclusions }: TripInclusionsProps) {
  if (!inclusions.length) return null
  return (
    <section style={{ background: 'var(--pm-midnight)', position: 'relative', zIndex: 2 }}>
      <div className="px-6 md:px-12 py-24">
        <TripSectionHeader eyebrow="The Full List" headline="ALL IN." sub="no surprises." />

        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', background: 'rgba(var(--pm-purple-rgb),0.1)' }}
        >
          {inclusions.map((item, i) => (
            <RevealOnScroll key={item.id ?? i} delay={i * 0.04} className="h-full">
              <div
                className="h-full py-7 px-6 text-center transition-colors duration-300"
                style={{ background: 'var(--pm-midnight)' }}
              >
                {item.icon && (
                  <div className="flex justify-center mb-3" style={{ color: 'var(--pm-purple)', filter: 'drop-shadow(0 0 8px rgba(var(--pm-purple-rgb),0.4))' }}>
                    <TripIcon name={item.icon} size={24} strokeWidth={1.5} />
                  </div>
                )}
                <p className="font-heading text-[0.9rem] tracking-[0.04em] text-white mb-1">{item.title}</p>
                {item.sub && (
                  <p className="text-[0.7rem] font-light leading-snug" style={{ color: 'rgba(232,232,240,0.55)' }}>{item.sub}</p>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div
            className="mt-6 px-6 py-4 flex items-center gap-4"
            style={{ border: '1px solid rgba(var(--pm-purple-rgb),0.12)' }}
          >
            <span className="size-2 rounded-full flex-shrink-0" style={{ background: 'var(--pm-purple)', boxShadow: '0 0 8px var(--pm-purple)' }} />
            <p className="text-[0.85rem] font-light italic" style={{ color: 'rgba(232,232,240,0.55)' }}>
              All packages are fully inclusive. Group sizes are kept small on purpose — this is a hosted experience, not a coach trip. Spaces go quickly.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
