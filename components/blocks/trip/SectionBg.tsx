'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { CoverImage } from '@/lib/data/trips'

/**
 * Drop inside any section with `position: relative; overflow: hidden`.
 * Renders a full-bleed background image + consistent brand overlay.
 * Returns null when no image is supplied — zero cost at runtime.
 *
 * Overlay design: base scrim (65%) + top/bottom gradient protection + left depth edge.
 * Effective darkness ≈ 62% at center, ≈ 79% at top/bottom edges — white text reads clean
 * at every weight across all section layouts.
 */
export function SectionBg({ bgImage }: { bgImage?: CoverImage | null }) {
  const reduce = useReducedMotion()
  if (!bgImage) return null

  return (
    <>
      {/* Image — Ken Burns scale on enter, fade in from whileInView */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: reduce ? 1 : 1.04, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          scale: { duration: reduce ? 0 : 10, ease: 'easeOut' },
          opacity: { duration: 0.9, ease: 'easeOut' },
        }}
      >
        <Image
          src={bgImage.url}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden="true"
        />
      </motion.div>

      {/* Layer 1: base scrim — uniform darkness across the whole image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(8,8,8,0.65)' }}
      />
      {/* Layer 2: top + bottom gradient — protects eyebrow/header text and bottom details */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,8,8,0.48) 0%, transparent 28%, transparent 72%, rgba(8,8,8,0.48) 100%)',
        }}
      />
      {/* Layer 3: left edge depth — reinforces reading direction anchor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(8,8,8,0.25) 0%, transparent 42%)' }}
      />
    </>
  )
}
