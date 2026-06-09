import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
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
        <RevealOnScroll>
          <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: '#FF2D78' }}>The Full Package</p>
          <h2 className="font-heading font-light text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.95 }}>
            EVERYTHING.<br /><em className="italic" style={{ color: 'var(--pm-purple-light)', fontSize: '0.75em' }}>included.</em>
          </h2>
          <div className="w-16 h-[3px] mb-10" style={{ background: 'linear-gradient(to right, #FF2D78, var(--pm-purple))' }} />
        </RevealOnScroll>

        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1px',
            background: 'rgba(107,95,204,0.15)',
            border: '1px solid rgba(107,95,204,0.15)',
          }}
        >
          {inclusions.map((item, i) => (
            <RevealOnScroll key={item.id ?? i} delay={i * 0.05}>
              <div
                className="p-9 relative overflow-hidden transition-colors duration-300 group"
                style={{ background: 'var(--pm-deep)' }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: 'linear-gradient(to right, var(--pm-purple), #FF2D78)' }}
                />
                {item.icon && <span className="text-3xl block mb-4">{item.icon}</span>}
                <p className="font-heading text-[1.1rem] text-white mb-2 leading-tight">{item.title}</p>
                {item.detail ? (
                  <p className="text-[0.85rem] leading-[1.75] font-light" style={{ color: 'rgba(232,232,240,0.5)' }}>
                    {item.detail}
                  </p>
                ) : item.sub ? (
                  <p className="text-[0.85rem] leading-[1.75] font-light" style={{ color: 'rgba(232,232,240,0.5)' }}>
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
        <RevealOnScroll>
          <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: '#FF2D78' }}>The Full List</p>
          <h2 className="font-heading font-light text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.95 }}>
            ALL IN.<br /><em className="italic" style={{ color: 'var(--pm-purple-light)', fontSize: '0.75em' }}>no surprises.</em>
          </h2>
          <div className="w-16 h-[3px] mb-10" style={{ background: 'linear-gradient(to right, #FF2D78, var(--pm-purple))' }} />
        </RevealOnScroll>

        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', background: 'rgba(107,95,204,0.1)' }}
        >
          {inclusions.map((item, i) => (
            <RevealOnScroll key={item.id ?? i} delay={i * 0.04}>
              <div
                className="py-7 px-6 text-center transition-colors duration-300"
                style={{ background: 'var(--pm-midnight)' }}
              >
                {item.icon && (
                  <span className="text-3xl block mb-3" style={{ filter: 'drop-shadow(0 0 8px rgba(107,95,204,0.4))' }}>
                    {item.icon}
                  </span>
                )}
                <p className="font-heading text-[0.9rem] tracking-[0.04em] text-white mb-1">{item.title}</p>
                {item.sub && (
                  <p className="text-[0.7rem] font-light leading-snug" style={{ color: 'rgba(232,232,240,0.4)' }}>{item.sub}</p>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div
            className="mt-6 px-6 py-4 flex items-center gap-4"
            style={{ border: '1px solid rgba(107,95,204,0.12)' }}
          >
            <span className="size-2 rounded-full flex-shrink-0" style={{ background: 'var(--pm-purple)', boxShadow: '0 0 8px var(--pm-purple)' }} />
            <p className="text-[0.85rem] font-light italic" style={{ color: 'rgba(232,232,240,0.4)' }}>
              All packages are fully inclusive. Group sizes are kept small on purpose — this is a hosted experience, not a coach trip. Spaces go quickly.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
