import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { renderRichText } from '@/lib/data/trips'
import type { SignatureExperience } from '@/lib/data/trips'

interface TripSignatureExperienceProps {
  experience: SignatureExperience
}

export function TripSignatureExperience({ experience }: TripSignatureExperienceProps) {
  if (!experience.heading && !experience.description) return null

  const bodyText = typeof experience.description === 'string'
    ? experience.description
    : renderRichText(experience.description)

  const paragraphs = bodyText.split('\n\n').filter(Boolean)

  return (
    <div
      style={{
        background: 'radial-gradient(ellipse at center bottom, rgba(var(--pm-purple-rgb),0.08) 0%, transparent 60%), var(--pm-midnight)',
        borderTop: '1px solid rgba(var(--pm-purple-rgb),0.1)',
        borderBottom: '1px solid rgba(var(--pm-purple-rgb),0.1)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="px-6 md:px-12 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-start">
          {/* Left: text */}
          <RevealOnScroll>
            {experience.eyebrow && (
              <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: 'var(--pm-accent)' }}>
                {experience.eyebrow}
              </p>
            )}
            {experience.heading && (
              <h2 className="font-heading font-light text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 0.95 }}>
                {experience.heading}
              </h2>
            )}
            <div className="w-16 h-[3px] mb-6" style={{ background: 'linear-gradient(to right, var(--pm-gold-dim), var(--pm-purple))' }} />
            <div className="space-y-4 max-w-xl">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-[0.9rem] leading-[1.9] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>
                  {para}
                </p>
              ))}
            </div>
          </RevealOnScroll>

          {/* Right: stats panel */}
          {experience.stats && experience.stats.length > 0 && (
            <RevealOnScroll delay={0.15}>
              <div style={{ border: '1px solid rgba(var(--pm-purple-rgb),0.15)' }}>
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
                      <p className="text-[0.9rem] font-light" style={{ color: 'rgba(232,232,240,0.7)' }}>{stat.value}</p>
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
