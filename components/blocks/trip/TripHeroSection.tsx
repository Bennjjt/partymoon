'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { CoverImage } from '@/lib/data/trips'

interface TripHeroSectionProps {
  destination: string
  date: string
  heroTagline?: string | null
  coverImage: CoverImage | null
  gradient: string
  priceFrom: string
  regionSvgPath?: string | null
  regionSvgViewBox?: string | null
}

export function TripHeroSection({
  destination,
  date,
  heroTagline,
  coverImage,
  gradient,
  priceFrom,
  regionSvgPath,
  regionSvgViewBox,
}: TripHeroSectionProps) {
  const reduce = useReducedMotion()

  const fade = (delay = 0) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: reduce ? 0.01 : 0.8, delay: reduce ? 0 : delay, ease: 'easeOut' as const },
  })

  const fadeUp = (delay = 0, y = 50) => ({
    initial: { opacity: 0, y: reduce ? 0 : y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.9, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  const slideX = (delay = 0) => ({
    initial: { opacity: 0, x: reduce ? 0 : -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, delay: reduce ? 0 : delay, ease: 'easeOut' as const },
  })

  const scaleRule = (delay = 0) => ({
    initial: { scaleX: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    animate: { scaleX: 1, opacity: 1 },
    transition: { duration: reduce ? 0.01 : 0.7, delay: reduce ? 0 : delay, ease: 'easeOut' as const },
  })

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ height: '100svh', maxHeight: '1000px', minHeight: '600px' }}
    >
      {/* ── Background ───────────────────────────────────────────── */}
      <motion.div className="absolute inset-0" {...fade(0)} transition={{ duration: reduce ? 0.01 : 1.2, ease: 'easeOut' }}>
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt || `${destination} — Partymoon VIP weekend`}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: gradient }} />
        )}
      </motion.div>

      {/* ── Vignette — four directional arms protect all text zones ── */}
      {/* Bottom: heaviest — protects h1 and metadata strip */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, #080808 0%, #080808cc 22%, rgba(8,8,8,0.45) 50%, transparent 72%)' }} />
      {/* Top: protects eyebrow against bright skies */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.65) 0%, transparent 28%)' }} />
      {/* Left: frames the h1 anchor */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(8,8,8,0.4) 0%, transparent 32%)' }} />
      {/* Right: protects tagline — always busy in crowd/venue shots */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(8,8,8,0.6) 0%, transparent 48%)' }} />

      {/* ── Country silhouette overlay ───────────────────────── */}
      {regionSvgPath && regionSvgViewBox && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-[1] overflow-hidden"
          {...fade(0.6)}
        >
          <svg
            viewBox={regionSvgViewBox}
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '-5%',
              bottom: '-10%',
              width: 'clamp(280px, 45vw, 560px)',
              height: 'clamp(280px, 45vw, 560px)',
            }}
          >
            <path
              d={regionSvgPath}
              fill="rgba(201,168,76,0.055)"
              stroke="rgba(201,168,76,0.18)"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      {/* ── Zone 1: Top-left eyebrow ──────────────────────────── */}
      <motion.p
        className="absolute left-6 md:left-14 z-10 text-[0.6rem] tracking-[0.45em] uppercase font-medium"
        style={{ top: 'calc(var(--navbar-h, 80px) + 1.5rem)', color: 'var(--pm-purple-light)' }}
        {...slideX(0.5)}
      >
        Partymoon&nbsp;&nbsp;·&nbsp;&nbsp;{destination}
      </motion.p>

      {/* ── Zone 2: Tagline + Destination name ───────────────── */}
      <div className="absolute left-0 right-0 z-10" style={{ bottom: 'clamp(140px, 18vh, 200px)' }}>
        {/* Tagline — right-aligned, sits directly above the h1 */}
        {heroTagline && (
          <motion.p
            className="hidden sm:block text-right font-heading italic pr-6 md:pr-14 mb-5"
            style={{
              fontSize: 'clamp(0.8rem, 1.05vw, 0.95rem)',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              letterSpacing: '0.01em',
              maxWidth: '44ch',
              marginLeft: 'auto',
            }}
            {...fade(0.2)}
          >
            {heroTagline}
          </motion.p>
        )}

        <div className="overflow-hidden px-6 md:px-14">
          <motion.h1
            className="font-heading font-light text-white leading-none"
            style={{
              fontSize: 'clamp(3.5rem, 14vw, 13rem)',
              letterSpacing: '-0.01em',
              lineHeight: 0.9,
            }}
            {...fadeUp(0.3, 60)}
          >
            {destination.toUpperCase()}
          </motion.h1>
        </div>
      </div>

      {/* ── Zone 3: Gold rule + metadata strip ───────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}
      >
        {/* Hairline gold rule */}
        <motion.div
          className="mx-6 md:mx-14 h-px mb-5 origin-left"
          style={{ background: 'linear-gradient(to right, var(--pm-purple), var(--pm-gold-dim), transparent)' }}
          {...scaleRule(0.6)}
        />

        {/* Three-column metadata strip */}
        <motion.div
          className="grid items-center px-6 md:px-14"
          style={{ gridTemplateColumns: '1fr 1fr auto', gap: 'clamp(1rem, 3vw, 3rem)' }}
          {...fade(0.75)}
        >
          {/* Left: Dates */}
          <div>
            <p className="text-[0.55rem] tracking-[0.4em] uppercase font-medium mb-1" style={{ color: 'var(--pm-purple-light)' }}>
              Dates
            </p>
            <p className="text-[0.8rem] font-light tracking-[0.02em]" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {date}
            </p>
          </div>

          {/* Center: Price */}
          <div>
            <p className="text-[0.55rem] tracking-[0.4em] uppercase font-medium mb-1" style={{ color: 'var(--pm-purple-light)' }}>
              From
            </p>
            <p className="font-heading text-[1.2rem] font-light text-white leading-none">
              {priceFrom}
              <span className="font-sans text-[0.65rem] font-light ml-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                pp
              </span>
            </p>
          </div>

          {/* Right: CTA */}
          <div id="book">
            <Link
              href="/#waitlist"
              className="text-[0.65rem] tracking-[0.2em] uppercase font-bold px-8 py-3 rounded-[2px] border transition-colors"
              style={{
                background: 'transparent',
                borderColor: 'var(--pm-purple)',
                color: 'var(--pm-purple)',
              }}
            >
              Secure your spot
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
