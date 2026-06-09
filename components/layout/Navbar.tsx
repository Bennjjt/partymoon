'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  /**
   * default          — transparent at page top, frosted when scrolled (homepage)
   * dark-scroll-hide — always dark, slides out when scrolling down, returns on scroll up (trip pages)
   */
  variant?: 'default' | 'dark-scroll-hide'
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY

      if (variant === 'dark-scroll-hide') {
        // Only start hiding after 80px so the navbar doesn't disappear immediately
        if (currentY > lastY.current && currentY > 80) {
          setVisible(false)
        } else {
          setVisible(true)
        }
      } else {
        setScrolled(currentY > 20)
      }

      lastY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [variant])

  const isDark = variant === 'dark-scroll-hide'

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12',
        !isDark && scrolled && 'border-b backdrop-blur-xl',
        isDark && 'border-b backdrop-blur-xl',
      )}
      style={{ borderColor: 'var(--pm-glass-border)' }}
      animate={{
        y: isDark && !visible ? '-100%' : '0%',
        // Framer Motion interpolates raw colour values — CSS variables cannot be
        // used here, so we use the literal value of --pm-midnight (#080808).
        backgroundColor: isDark
          ? '#080808'
          : scrolled ? '#080808' : 'rgba(0,0,0,0)',
        paddingTop:    isDark ? '1rem'  : scrolled ? '1rem'  : '1.5rem',
        paddingBottom: isDark ? '1rem'  : scrolled ? '1rem'  : '1.5rem',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Link href="/" className="flex items-center gap-3 flex-shrink-0">
        <MoonIcon />
        <span
          className="font-heading text-2xl font-normal tracking-[0.15em]"
          style={{ color: 'var(--pm-purple)' }}
        >
          Partymoon
        </span>
      </Link>

      <a
        href="#book"
        className="text-[0.65rem] tracking-[0.15em] uppercase px-6 py-[0.7rem] border rounded-[2px] font-medium transition-colors"
        style={{ borderColor: 'var(--pm-purple)', color: 'var(--pm-purple)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--pm-purple)'
          e.currentTarget.style.color = 'var(--pm-midnight)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--pm-purple)'
        }}
      >
        Reserve your place
      </a>
    </motion.nav>
  )
}

function MoonIcon() {
  return (
    <div
      className="relative size-7 rounded-full overflow-hidden flex-shrink-0"
      style={{ background: 'var(--pm-moon)' }}
    >
      <div
        className="absolute size-[22px] rounded-full"
        style={{ background: 'var(--pm-midnight)', top: '3px', left: '9px' }}
      />
    </div>
  )
}
