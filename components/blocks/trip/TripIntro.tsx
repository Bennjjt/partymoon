'use client'

import Image from 'next/image'
import { PortableText } from 'next-sanity'
import type { PortableTextBlock } from 'next-sanity'
import { motion, useReducedMotion } from 'framer-motion'
import type { CoverImage, Trip } from '@/lib/data/trips'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { TripSectionHeader } from '@/components/blocks/trip/TripSectionHeader'

interface TripIntroProps {
  destination: string
  introText?: PortableTextBlock[]
  introImages?: CoverImage[]
  coverImage?: CoverImage | null
  gallery?: Trip['gallery']
}

// Resolve up to 3 images from available sources, priority: introImages → gallery → coverImage repeats.
function resolveImages(
  introImages: CoverImage[] | undefined,
  gallery: Trip['gallery'],
  coverImage: CoverImage | null | undefined,
): [CoverImage | null, CoverImage | null, CoverImage | null] {
  const pool: CoverImage[] = []

  if (introImages?.length) pool.push(...introImages)

  if (pool.length < 3 && gallery?.length) {
    for (const g of gallery) {
      if (g.image && pool.length < 3) pool.push(g.image)
    }
  }

  if (pool.length < 3 && coverImage) {
    while (pool.length < 3) pool.push(coverImage)
  }

  return [pool[0] ?? null, pool[1] ?? null, pool[2] ?? null]
}

export function TripIntro({ destination, introText, introImages, coverImage, gallery }: TripIntroProps) {
  const reduce = useReducedMotion()

  if (!introText?.length) return null
  const [img1, img2, img3] = resolveImages(introImages, gallery, coverImage)
  const hasBento = img1 !== null

  const enter = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: reduce ? 0.01 : 0.8, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section style={{ background: 'var(--pm-deep)', position: 'relative', zIndex: 2 }}>
      <div className="px-6 md:px-12 py-24">
        <div className={`grid gap-16 xl:gap-24 ${hasBento ? 'xl:grid-cols-[1fr_1fr] items-center' : ''}`}>

          {/* ── Left col: heading + prose ─────────────────────── */}
          <div>
            <TripSectionHeader
              eyebrow="The Partymoon Way"
              headline={`${destination.toUpperCase()}.`}
              sub="the way it should be done."
              dividerClass="mb-8"
            />
            <RevealOnScroll>
              <div className="space-y-4 max-w-[60ch]">
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

          {/* ── Right col: asymmetric 3-image bento ───────────── */}
          {hasBento && (
            <div
              className="grid gap-[2px]"
              style={{
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1.3fr',
                // Gap colour is a faint gold seam — structural, not decorative
                background: 'rgba(var(--pm-purple-rgb),0.18)',
                minHeight: 'clamp(300px, 38vw, 500px)',
              }}
            >
              {/* img1 — wide landscape spanning both columns */}
              <BentoTile image={img1} alt={img1?.alt ?? `${destination} — atmosphere`} motionProps={enter(0)} style={{ gridColumn: '1 / -1' }} />
              {/* img2 — bottom-left square */}
              <BentoTile image={img2} alt={img2?.alt ?? `${destination} — detail`} motionProps={enter(0.1)} />
              {/* img3 — bottom-right portrait */}
              <BentoTile image={img3} alt={img3?.alt ?? `${destination} — experience`} motionProps={enter(0.2)} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function BentoTile({
  image,
  alt,
  motionProps,
  style,
}: {
  image: CoverImage | null
  alt: string
  motionProps: object
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      className="relative overflow-hidden group"
      style={{ background: 'var(--pm-midnight)', ...style }}
      {...motionProps}
    >
      {image && (
        <>
          <Image
            src={image.url}
            alt={alt}
            fill
            sizes="(max-width: 1279px) 90vw, (max-width: 1535px) 40vw, 30vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {/* Permanent dark vignette at base — keeps any overlaid details legible */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.35) 0%, transparent 50%)' }}
          />
          {/* Gold shimmer on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(var(--pm-purple-rgb),0.18) 0%, transparent 65%)' }}
          />
          {/* Gold border highlight on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1px]"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(var(--pm-purple-rgb),0.5)' }}
          />
        </>
      )}
    </motion.div>
  )
}
