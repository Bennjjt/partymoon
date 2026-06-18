import { PortableText } from 'next-sanity'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { TripSectionHeader } from '@/components/blocks/trip/TripSectionHeader'
import { SectionBg } from '@/components/blocks/trip/SectionBg'
import type { SignatureExperience, CoverImage } from '@/lib/data/trips'

interface TripSignatureExperienceProps {
  experience: SignatureExperience
  bgImage?: CoverImage | null
}

export function TripSignatureExperience({ experience, bgImage }: TripSignatureExperienceProps) {
  if (!experience.heading && !experience.description?.length) return null

  return (
    <div
      style={{
        background: bgImage ? 'transparent' : 'radial-gradient(ellipse at center bottom, rgba(var(--pm-purple-rgb),0.08) 0%, transparent 60%), var(--pm-midnight)',
        borderTop: '1px solid rgba(var(--pm-purple-rgb),0.1)',
        borderBottom: '1px solid rgba(var(--pm-purple-rgb),0.1)',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 2,
      }}
    >
      <SectionBg bgImage={bgImage} />
      <div className="px-6 md:px-12 py-24 relative" style={{ zIndex: 1 }}>
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-start">
          {/* Left: text */}
          <div>
            {(experience.eyebrow || experience.heading) && (
              <TripSectionHeader
                eyebrow={experience.eyebrow ?? ''}
                headline={experience.heading ?? ''}
              />
            )}
            {experience.description && experience.description.length > 0 && (
              <RevealOnScroll>
                <div className="space-y-4 max-w-xl">
                  <PortableText
                    value={experience.description}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <p className="text-[0.9rem] leading-[1.9] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>
                            {children}
                          </p>
                        ),
                      },
                    }}
                  />
                </div>
              </RevealOnScroll>
            )}
          </div>

          {/* Right: stats panel */}
          {experience.stats && experience.stats.length > 0 && (
            <RevealOnScroll delay={0.15}>
              <div style={{ border: '1px solid rgba(var(--pm-purple-rgb),0.15)', background: bgImage ? 'rgba(8,8,8,0.62)' : 'transparent' }}>
                {experience.stats.map((stat, i) => (
                  <div
                    key={stat.id ?? i}
                    className="grid items-center gap-4 px-6 py-5"
                    style={{
                      borderBottom: i < experience.stats!.length - 1 ? '1px solid rgba(var(--pm-purple-rgb),0.1)' : 'none',
                      gridTemplateColumns: '1fr auto',
                    }}
                  >
                    <div>
                      <p className="text-[0.6rem] tracking-[0.35em] uppercase mb-1 font-medium" style={{ color: 'rgba(var(--pm-purple-rgb),0.6)' }}>
                        {stat.label}
                      </p>
                      <p className="text-[0.9rem] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>{stat.value}</p>
                    </div>
                    {stat.tag && (
                      <span
                        className="text-[0.55rem] tracking-[0.2em] uppercase px-3 py-1 rounded-full whitespace-nowrap font-medium"
                        style={{ background: 'rgba(var(--pm-purple-rgb),0.15)', color: 'var(--pm-purple)', border: '1px solid rgba(var(--pm-purple-rgb),0.3)' }}
                      >
                        {stat.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          )}
        </div>
      </div>
    </div>
  )
}
