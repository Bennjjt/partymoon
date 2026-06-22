import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
}

export default function CookiePolicyPage() {
  return (
    <>
      <main
        className="min-h-screen px-6 md:px-12 py-36"
        style={{ background: 'var(--pm-midnight)' }}
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-[0.6rem] tracking-[0.4em] uppercase mb-6" style={{ color: 'var(--pm-accent)' }}>
            Legal
          </p>
          <h1
            className="font-heading font-light text-white leading-none mb-12"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            COOKIE POLICY.
          </h1>
          <p className="text-[0.9rem] leading-[1.8] font-light" style={{ color: 'rgba(232,232,240,0.55)' }}>
            This page is coming soon. Please check back shortly.
          </p>
          <Link
            href="/"
            className="inline-block mt-12 text-[0.65rem] tracking-[0.2em] uppercase font-bold px-8 py-3 rounded-[2px] border transition-colors"
            style={{ borderColor: 'rgba(var(--pm-purple-rgb),0.4)', color: 'var(--pm-purple-light)' }}
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
