import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { TripDiningExperience } from '@/lib/data/trips'

interface TripDiningProps {
  diningExperiences: TripDiningExperience[]
}

export function TripDining({ diningExperiences }: TripDiningProps) {
  if (!diningExperiences.length) return null

  return (
    <section style={{ background: 'var(--pm-deep)', position: 'relative', zIndex: 2 }}>
      <div className="px-6 md:px-12 py-24">
        <RevealOnScroll>
          <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: '#FF2D78' }}>Two Evenings</p>
          <h2 className="font-heading font-light text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.95 }}>
            THE FOOD.<br />
            <em className="italic" style={{ color: 'var(--pm-purple-light)', fontSize: '0.75em' }}>always worth it.</em>
          </h2>
          <div className="w-16 h-[3px] mb-10" style={{ background: 'linear-gradient(to right, #FF2D78, var(--pm-purple))' }} />
        </RevealOnScroll>

        <div style={{ background: 'rgba(107,95,204,0.1)' }} className="flex flex-col gap-[1.5px]">
          {diningExperiences.map((item, i) => (
            <RevealOnScroll key={item.id ?? i} delay={i * 0.1}>
              <div
                className="grid gap-8 items-center px-8 py-8 transition-colors duration-200 group"
                style={{
                  background: 'var(--pm-navy)',
                  gridTemplateColumns: '100px 1fr',
                }}
              >
                <div className="text-center">
                  <p className="font-heading text-[2rem] leading-none" style={{ color: 'rgba(107,95,204,0.3)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  {item.nightLabel && (
                    <p className="text-[0.55rem] tracking-[0.3em] uppercase font-medium mt-1" style={{ color: '#FF2D78' }}>
                      {item.nightLabel}
                    </p>
                  )}
                </div>
                <div>
                  <p className="font-heading text-[1.2rem] leading-tight text-white mb-2">{item.title}</p>
                  {item.description && (
                    <p className="text-[0.9rem] leading-[1.75] font-light" style={{ color: 'rgba(232,232,240,0.5)' }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
