'use client'

import { joinWaitlist } from '@/app/actions/joinWaitlist'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function WaitlistSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await joinWaitlist({ email: email.trim(), name: name.trim() || undefined })

    setLoading(false)

    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error)
    }
  }

  return (
    <section
      className="px-6 md:px-12 py-24 text-center"
      style={{ background: 'var(--pm-midnight)' }}
      id="waitlist"
    >
      <motion.div
        className="max-w-[600px] mx-auto"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p
          className="text-[0.6rem] tracking-[0.35em] uppercase mb-3"
          style={{ color: 'var(--pm-purple-light)' }}
        >
          Join the list
        </p>
        <h2
          className="font-heading font-light leading-[1.2] mb-6"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          Be first <em className="italic">in</em>
        </h2>

        <p className="font-heading text-[3rem] text-white mt-8">14,247</p>
        <p
          className="text-[0.65rem] tracking-[0.2em] uppercase mb-6"
          style={{ color: 'var(--pm-purple-light)' }}
        >
          People already on the waitlist
        </p>

        <p className="text-[0.75rem] tracking-[0.08em] leading-[2] text-white/50 mb-8">
          Join now for early access, founding member pricing and priority booking on all new
          destinations before they go public.
        </p>

        {submitted ? (
          <p className="text-[0.75rem] tracking-[0.08em]" style={{ color: '#5DCAA5' }}>
            You&apos;re on the list. We&apos;ll be in touch very soon.
          </p>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="flex-1 min-w-0 px-6 py-4 rounded-[2px] text-[0.75rem] tracking-[0.08em] text-white placeholder-white/30 outline-none transition-colors disabled:opacity-50"
                style={{ background: 'var(--pm-deep)', border: '1px solid var(--pm-glass-border)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pm-purple)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pm-glass-border)')}
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="flex-1 min-w-0 px-6 py-4 rounded-[2px] text-[0.75rem] tracking-[0.08em] text-white placeholder-white/30 outline-none transition-colors disabled:opacity-50"
                style={{ background: 'var(--pm-deep)', border: '1px solid var(--pm-glass-border)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pm-purple)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pm-glass-border)')}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-[2px] text-[0.65rem] tracking-[0.2em] uppercase transition-opacity disabled:opacity-60"
                style={{ background: 'var(--pm-purple)', color: 'var(--pm-midnight)' }}
              >
                {loading ? 'Joining…' : 'Join the waitlist'}
              </button>
            </form>

            {error && (
              <p
                className="text-[0.7rem] tracking-[0.05em] mt-3"
                style={{ color: '#f09595' }}
              >
                {error}
              </p>
            )}
          </>
        )}

        <p className="text-[0.65rem] tracking-[0.1em] text-white/30 mt-4">
          No spam. Early access only. Unsubscribe any time.
        </p>
      </motion.div>
    </section>
  )
}
