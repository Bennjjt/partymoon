'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { FormWrapper } from '@/components/forms/FormWrapper'
import type { DestinationOption } from '@/components/blocks/DestinationStrip'

// ── Country codes ────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: '+44',  flag: '🇬🇧' },
  { code: '+1',   flag: '🇺🇸' },
  { code: '+353', flag: '🇮🇪' },
  { code: '+33',  flag: '🇫🇷' },
  { code: '+49',  flag: '🇩🇪' },
  { code: '+31',  flag: '🇳🇱' },
  { code: '+34',  flag: '🇪🇸' },
  { code: '+39',  flag: '🇮🇹' },
  { code: '+41',  flag: '🇨🇭' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+852', flag: '🇭🇰' },
  { code: '+61',  flag: '🇦🇺' },
  { code: '+27',  flag: '🇿🇦' },
]

// ── Validation schema ─────────────────────────────────────────────
const schema = z.object({
  name:             z.string().min(1, 'Name is required'),
  email:            z.string().email('Enter a valid email address'),
  countryCode:      z.string().min(1),
  mobile:           z.string().min(7, 'Enter a valid mobile number').regex(/^[0-9\s\-()]+$/, 'Numbers only'),
  destination:      z.string().min(1, 'Please select a destination'),
  groupSize:        z.coerce.number()
                      .int('Whole numbers only')
                      .min(2, 'Minimum group size is 2')
                      .max(50, 'Maximum group size is 50'),
  message:          z.string().optional(),
  marketingConsent: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

interface WaitlistSectionProps {
  destinations?: DestinationOption[]
}

// ── Shared style tokens ───────────────────────────────────────────
const fieldBase =
  'w-full px-4 py-3.5 rounded-[2px] text-[0.8rem] tracking-[0.02em] text-white placeholder-white/30 outline-none transition-all duration-200 bg-[var(--pm-deep)] border border-[var(--pm-glass-border)] focus:border-[var(--pm-purple)] focus:bg-[rgba(var(--pm-purple-rgb),0.04)]'

const labelBase = 'block text-[0.58rem] tracking-[0.3em] uppercase font-medium mb-2'
const errorBase = 'mt-1.5 text-[0.65rem] tracking-[0.03em]'

const CARET = (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
    <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function WaitlistSection({ destinations = [] }: WaitlistSectionProps) {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleSubmit = async (values: FormValues) => {
    setServerError('')

    const projectId = process.env.NEXT_PUBLIC_FORMSPREE_PROJECT_ID
    if (!projectId) {
      setServerError('Form is not configured. Please contact us directly.')
      return
    }

    const res = await fetch(`https://formspree.io/p/${projectId}/f/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name:              values.name,
        email:             values.email,
        mobile:            `${values.countryCode} ${values.mobile}`,
        destination:       values.destination,
        groupSize:         values.groupSize,
        message:           values.message || undefined,
        marketingConsent:  values.marketingConsent ? 'Yes' : 'No',
      }),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json().catch(() => ({}))
      setServerError((data?.errors?.[0]?.message as string) ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <section
      className="relative"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(var(--pm-purple-rgb),0.07) 0%, transparent 55%), var(--pm-midnight)',
        borderTop: '1px solid rgba(var(--pm-purple-rgb),0.15)',
      }}
      id="waitlist"
    >
      <div className="px-6 md:px-12 py-24 grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24 items-start max-w-[1280px] mx-auto">

        {/* ── Left: identity block ───────────────────────────────── */}
        <motion.div
          className="lg:sticky lg:top-28"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[0.58rem] tracking-[0.4em] uppercase font-medium mb-4" style={{ color: 'var(--pm-purple-light)' }}>
            Enquire
          </p>
          <h2
            className="font-heading font-light leading-[0.95] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', textWrap: 'balance' }}
          >
            Reserve your<br />
            <em className="italic" style={{ color: 'var(--pm-purple)' }}>place.</em>
          </h2>

          <div className="w-14 h-[3px] mb-8" style={{ background: 'linear-gradient(to right, var(--pm-purple), var(--pm-gold))' }} />

          <p className="text-[0.875rem] leading-[1.9] font-light max-w-[38ch]" style={{ color: 'rgba(232,232,240,0.6)' }}>
            Tell us where you want to go and we&apos;ll reach out with availability, pricing, and everything your group needs to know.
          </p>

          <ul className="mt-8 space-y-3">
            {['No payment required to enquire', 'Response within 24 hours', 'Group pricing on request'].map((line) => (
              <li key={line} className="flex items-center gap-3">
                <span className="size-[5px] rounded-full flex-shrink-0" style={{ background: 'var(--pm-purple)' }} />
                <span className="text-[0.72rem] tracking-[0.04em] font-light" style={{ color: 'rgba(232,232,240,0.55)' }}>{line}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Right: form ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessState key="success" />
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <FormWrapper<FormValues>
                  schema={schema}
                  onSubmit={handleSubmit}
                  defaultValues={{
                    countryCode:      '+44',
                    destination:      '',
                    marketingConsent: false,
                    groupSize:        undefined as unknown as number,
                  }}
                  className="space-y-5"
                >
                  {({ register, formState: { errors, isSubmitting }, watch, setValue }) => {
                    const currentCode = watch('countryCode')
                    const marketingChecked = watch('marketingConsent')

                    return (
                      <>
                        {/* Row 1: Name + Email */}
                        <div className="grid sm:grid-cols-2 gap-5">
                          <Field label="Full name" error={errors.name?.message}>
                            <input {...register('name')} placeholder="Alex Johnson" className={fieldBase} />
                          </Field>
                          <Field label="Email address" error={errors.email?.message}>
                            <input {...register('email')} type="email" placeholder="alex@example.com" className={fieldBase} />
                          </Field>
                        </div>

                        {/* Row 2: Mobile */}
                        <Field label="Mobile number" error={errors.mobile?.message}>
                          <div className="flex">
                            <div className="relative flex-shrink-0">
                              <select
                                value={currentCode}
                                onChange={(e) => setValue('countryCode', e.target.value)}
                                className="appearance-none h-full pl-3 pr-8 rounded-l-[2px] rounded-r-none text-[0.78rem] text-white border border-r-0 border-[var(--pm-glass-border)] bg-[var(--pm-deep)] focus:outline-none focus:border-[var(--pm-purple)] transition-colors cursor-pointer"
                                style={{ minWidth: '5.5rem' }}
                              >
                                {COUNTRY_CODES.map(({ code, flag }) => (
                                  <option key={code} value={code}>{flag} {code}</option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">{CARET}</div>
                            </div>
                            <input
                              {...register('mobile')}
                              type="tel"
                              placeholder="7911 123456"
                              className={`${fieldBase} rounded-l-none flex-1`}
                            />
                          </div>
                        </Field>

                        {/* Row 3: Destination + Group size */}
                        <div className="grid sm:grid-cols-2 gap-5">
                          <Field label="Destination" error={errors.destination?.message}>
                            <div className="relative">
                              <select {...register('destination')} className={`${fieldBase} appearance-none pr-9 cursor-pointer`}>
                                <option value="" disabled>Select a city</option>
                                {destinations.length > 0
                                  ? destinations.map(({ label, value }) => (
                                      <option key={value} value={value}>{label}</option>
                                    ))
                                  : <>
                                      <option value="ibiza">Ibiza</option>
                                      <option value="mykonos">Mykonos</option>
                                      <option value="amsterdam">Amsterdam</option>
                                      <option value="barcelona">Barcelona</option>
                                      <option value="berlin">Berlin</option>
                                      <option value="copenhagen">Copenhagen</option>
                                    </>
                                }
                                <option value="other">Not sure yet</option>
                              </select>
                              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">{CARET}</div>
                            </div>
                          </Field>

                          <Field label="Group size" error={errors.groupSize?.message}>
                            <input
                              {...register('groupSize')}
                              type="number"
                              min="2"
                              max="50"
                              placeholder="8"
                              className={fieldBase}
                            />
                          </Field>
                        </div>

                        {/* Row 4: Message */}
                        <Field label="Message (optional)" error={errors.message?.message}>
                          <textarea
                            {...register('message')}
                            rows={4}
                            placeholder="Anything useful — travel dates, group vibe, specific requests…"
                            className={`${fieldBase} resize-none`}
                          />
                        </Field>

                        {/* Marketing opt-in */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={!!marketingChecked}
                            onClick={() => setValue('marketingConsent', !marketingChecked, { shouldValidate: true })}
                            className="mt-[2px] flex-shrink-0 size-4 rounded-[2px] border transition-all duration-150 flex items-center justify-center"
                            style={{
                              borderColor: marketingChecked ? 'var(--pm-purple)' : 'rgba(255,255,255,0.2)',
                              background:  marketingChecked ? 'var(--pm-purple)' : 'transparent',
                            }}
                          >
                            {marketingChecked && (
                              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                <path d="M1 3.5l2.5 2.5L8 1" stroke="var(--pm-midnight)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </button>
                          <span className="text-[0.72rem] leading-[1.7] font-light" style={{ color: 'rgba(232,232,240,0.72)' }}>
                            Keep me updated with new destinations, early access, and exclusive offers from Partymoon.
                          </span>
                        </label>

                        {/* Server error */}
                        {serverError && (
                          <p className="text-[0.7rem] tracking-[0.03em]" style={{ color: 'rgba(255,120,120,0.9)' }}>
                            {serverError}
                          </p>
                        )}

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 rounded-[2px] text-[0.65rem] tracking-[0.25em] uppercase font-bold transition-all duration-200 disabled:opacity-60 mt-1 border border-transparent"
                          style={{ background: 'var(--pm-purple)', color: 'var(--pm-midnight)' }}
                          onMouseEnter={(e) => {
                            if (!isSubmitting) {
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.color = 'var(--pm-purple)'
                              e.currentTarget.style.borderColor = 'var(--pm-purple)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--pm-purple)'
                            e.currentTarget.style.color = 'var(--pm-midnight)'
                            e.currentTarget.style.borderColor = 'transparent'
                          }}
                        >
                          <AnimatePresence mode="wait">
                            {isSubmitting ? (
                              <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                Sending…
                              </motion.span>
                            ) : (
                              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                Send enquiry
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>

                        {/* Privacy notice */}
                        <p className="text-[0.6rem] leading-[1.8] tracking-[0.02em] text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          By submitting this form you agree to our{' '}
                          <Link
                            href="/privacy-policy"
                            className="underline underline-offset-2 transition-colors"
                            style={{ color: 'var(--pm-purple-light)' }}
                          >
                            Privacy Policy
                          </Link>
                          . No commitment required · We respond within 24 hours.
                        </p>
                      </>
                    )
                  }}
                </FormWrapper>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelBase} style={{ color: error ? 'rgba(255,120,120,0.9)' : 'var(--pm-purple-light)' }}>
        {label}
      </label>
      {children}
      {error && (
        <p className={errorBase} style={{ color: 'rgba(255,120,120,0.9)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

function SuccessState() {
  return (
    <motion.div
      className="py-16 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto mb-8 size-16 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(var(--pm-purple-rgb),0.4)', background: 'rgba(var(--pm-purple-rgb),0.06)' }}>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <path d="M1 8l6.5 6.5L21 1" stroke="var(--pm-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 className="font-heading font-light text-white leading-[1.1] mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
        Enquiry received.
      </h3>
      <p className="text-[0.875rem] leading-[1.85] font-light max-w-[38ch] mx-auto" style={{ color: 'rgba(232,232,240,0.6)' }}>
        We&apos;ll be in touch within 24 hours with availability and everything your group needs.
      </p>
    </motion.div>
  )
}
