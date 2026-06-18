import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { TripSectionHeader } from '@/components/blocks/trip/TripSectionHeader'
import { SectionBg } from '@/components/blocks/trip/SectionBg'
import type { TripDiningExperience, CoverImage } from '@/lib/data/trips'

interface TripDiningProps {
  diningExperiences: TripDiningExperience[]
  bgImage?: CoverImage | null
}

export function TripDining({ diningExperiences, bgImage }: TripDiningProps) {
  if (!diningExperiences.length) return null

  return (
    <section style={{ background: bgImage ? 'transparent' : 'var(--pm-deep)', position: 'relative', overflow: 'hidden', zIndex: 2 }}>
      <SectionBg bgImage={bgImage} />
      <div className="px-6 md:px-12 py-24 relative" style={{ zIndex: 1 }}>
        <TripSectionHeader eyebrow="Two Evenings" headline="THE FOOD." sub="always worth it." />

        <div style={{ background: 'rgba(var(--pm-purple-rgb),0.1)' }} className="flex flex-col gap-[1.5px]">
          {diningExperiences.map((item, i) => (
            <RevealOnScroll key={item.id ?? i} delay={i * 0.1}>
              <div
                className="grid gap-8 items-center px-8 py-8 transition-colors duration-200 group"
                style={{ background: 'var(--pm-navy)', gridTemplateColumns: '100px 1fr' }}
              >
                <div className="text-center">
                  <p className="font-heading text-[2rem] leading-none" style={{ color: 'rgba(var(--pm-purple-rgb),0.3)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  {item.nightLabel && (
                    <p className="text-[0.55rem] tracking-[0.3em] uppercase font-medium mt-1" style={{ color: 'var(--pm-accent)' }}>
                      {item.nightLabel}
                    </p>
                  )}
                </div>
                <div>
                  <p className="font-heading text-[1.2rem] leading-tight text-white mb-2">{item.title}</p>
                  {item.description && (
                    <p className="text-[0.9rem] leading-[1.75] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>
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
