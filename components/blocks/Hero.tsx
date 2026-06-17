'use client'

import { motion, useReducedMotion } from 'framer-motion'

const VIDEO_SRC = '/videos/hero.mp4'

function useFadeUp() {
  const reduce = useReducedMotion()
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 30 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : delay, ease: 'easeOut' as const },
    }),
  }
}

export function Hero() {
  const fadeUp = useFadeUp()
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 overflow-hidden"
      id="home"
    >
      {/* Fullscreen video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'rgba(0,0,0,0.48)' }} />

      {/* Bottom gradient — blends into the next section */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'var(--hero-overlay-gradient)' }}
      />

      {/* Eyebrow */}
      <motion.p
        className="relative z-[2] text-[0.65rem] tracking-[0.35em] uppercase mb-8"
        style={{ color: 'var(--pm-purple-light)' }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
      >
        Six cities&nbsp;&nbsp;·&nbsp;&nbsp;Every weekend&nbsp;&nbsp;·&nbsp;&nbsp;Nothing to organise
      </motion.p>

      {/* Headline */}
      <motion.h1
        className="relative z-[2] font-heading font-light leading-[1.1] tracking-[0.02em] mb-8 text-white"
        style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', textWrap: 'balance' }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        Europe&apos;s most
        <br />
        <em className="italic">exclusive</em> VIP
        <br />
        weekends, handled.
      </motion.h1>

      {/* Sub */}
      <motion.p
        className="relative z-[2] text-[0.8rem] tracking-[0.1em] leading-[2] text-white/70 max-w-[500px] mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.6}
      >
        Flights, five-star hotels, VIP tables, transfers — every detail curated. You simply show up
        and live it.
      </motion.p>

      {/* CTAs */}
      <motion.div
        className="relative z-[2] flex items-center justify-center gap-4 flex-wrap"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.8}
      >
        <a
          href="#trips"
          className="text-[0.65rem] tracking-[0.2em] uppercase font-bold px-10 py-4 rounded-[2px] border transition-colors"
          style={{
            background: 'var(--pm-purple)',
            borderColor: 'var(--pm-purple)',
            color: 'var(--pm-midnight)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          View all weekends
        </a>
        <a
          href="#silk"
          className="text-[0.65rem] tracking-[0.2em] uppercase font-bold px-10 py-4 rounded-[2px] border transition-colors text-pm-gold"
          style={{ borderColor: 'var(--pm-gold-dim)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(var(--pm-gold-rgb),0.08)'
            e.currentTarget.style.borderColor = 'var(--pm-gold)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'var(--pm-gold-dim)'
          }}
        >
          Silk Soiree — women&apos;s VIP
        </a>
      </motion.div>

      {/* Scroll line */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1.2}
      >
        <motion.div
          className="w-px h-[50px]"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--pm-purple))', willChange: 'opacity' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
