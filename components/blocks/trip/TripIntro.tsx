import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { renderRichText } from '@/lib/data/trips'

interface TripIntroProps {
  destination: string
  introText?: unknown
}

export function TripIntro({ destination, introText }: TripIntroProps) {
  if (!introText) return null
  const paragraphs = renderRichText(introText).split('\n\n').filter(Boolean)
  if (!paragraphs.length) return null

  return (
    <section style={{ background: 'var(--pm-deep)', position: 'relative', zIndex: 2 }}>
      <div className="px-6 md:px-12 py-24">
        <RevealOnScroll>
          <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: '#FF2D78' }}>
            The Partymoon Way
          </p>
          <h2 className="font-heading font-light text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.95 }}>
            {destination.toUpperCase()}.<br />
            <em className="italic" style={{ color: 'var(--pm-purple-light)', fontSize: '0.75em' }}>
              the way it should be done.
            </em>
          </h2>
          <div className="w-16 h-[3px] mb-8" style={{ background: 'linear-gradient(to right, #FF2D78, var(--pm-purple))' }} />
          <div className="space-y-4 max-w-2xl">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-[0.95rem] leading-[1.9] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>
                {para}
              </p>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
