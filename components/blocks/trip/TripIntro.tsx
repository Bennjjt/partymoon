import { PortableText } from 'next-sanity'
import type { PortableTextBlock } from 'next-sanity'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { TripSectionHeader } from '@/components/blocks/trip/TripSectionHeader'

interface TripIntroProps {
  destination: string
  introText?: PortableTextBlock[]
}

export function TripIntro({ destination, introText }: TripIntroProps) {
  if (!introText?.length) return null

  return (
    <section style={{ background: 'var(--pm-deep)', position: 'relative', zIndex: 2 }}>
      <div className="px-6 md:px-12 py-24">
        <TripSectionHeader
          eyebrow="The Partymoon Way"
          headline={`${destination.toUpperCase()}.`}
          sub="the way it should be done."
          dividerClass="mb-8"
        />
        <RevealOnScroll>
          <div className="space-y-4 max-w-2xl">
            <PortableText
              value={introText}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="text-[0.95rem] leading-[1.9] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>
                      {children}
                    </p>
                  ),
                },
              }}
            />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
