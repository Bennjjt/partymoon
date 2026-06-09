'use client'

import { createPaymentIntent } from '@/app/actions/createPaymentIntent'
import type { BookingTarget } from '@/components/providers/BookingProvider'
import { stripePromise } from '@/lib/stripe-client'
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import type { StripeCardElementOptions } from '@stripe/stripe-js'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/* ── Constants ────────────────────────────────────────────────── */

const PACKAGES = [
  { label: 'Essential', value: 2200 },
  { label: 'Premium', value: 3500 },
  { label: 'Ultimate', value: 6000 },
]

const DEPOSIT_PER_PERSON = 300

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '15px',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: 'rgba(255,255,255,0.3)' },
      iconColor: 'rgba(255,255,255,0.5)',
    },
    invalid: { color: '#f09595', iconColor: '#f09595' },
  },
  hidePostalCode: true,
}

/* ── Step transition ──────────────────────────────────────────── */

const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' as const } },
}

/* ── Types ────────────────────────────────────────────────────── */

type Step = 'form' | 'summary' | 'card' | 'success'

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  pkgValue: number
  partySize: number
  specialRequests: string
}

/* ── Main modal ───────────────────────────────────────────────── */

interface Props {
  target: BookingTarget
  onClose: () => void
}

export function BookingModal({ target, onClose }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pkgValue: 3500,
    partySize: 1,
    specialRequests: '',
  })
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentLoading, setIntentLoading] = useState(false)
  const [intentError, setIntentError] = useState('')

  const overlayRef = useRef<HTMLDivElement>(null)
  const isLocked = step === 'card' || intentLoading

  const totalDeposit = DEPOSIT_PER_PERSON * form.partySize
  const selectedPkg = PACKAGES.find((p) => p.value === form.pkgValue) ?? PACKAGES[1]
  const balancePerPerson = form.pkgValue - DEPOSIT_PER_PERSON

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLocked) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, isLocked])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('summary')
  }

  const handleBack = () => {
    if (step === 'card') setStep('summary')
    else setStep('form')
  }

  const handleContinueToPayment = async () => {
    setIntentLoading(true)
    setIntentError('')

    const result = await createPaymentIntent({
      tripId: target.destination,
      name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      email: form.email.trim(),
      partySize: form.partySize,
      depositAmount: totalDeposit * 100, // pounds → pence
    })

    setIntentLoading(false)

    if (!result.success) {
      setIntentError(result.error)
      return
    }

    setClientSecret(result.clientSecret)
    setStep('card')
  }

  const stepTitles: Record<Step, string> = {
    form: `Reserve your place — ${target.destination}`,
    summary: 'Confirm your booking',
    card: 'Secure payment',
    success: 'Reservation received',
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(15,15,30,0.97)' }}
      onClick={(e) => { if (e.target === overlayRef.current && !isLocked) onClose() }}
    >
      <div
        className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[2px] border"
        style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-8 border-b sticky top-0 z-10"
          style={{
            background: 'var(--pm-deep)',
            borderColor: 'var(--pm-glass-border)',
          }}
        >
          <div>
            {step !== 'form' && step !== 'success' && (
              <button
                onClick={handleBack}
                className="text-[0.6rem] tracking-[0.15em] uppercase text-white/40 hover:text-white mb-2 flex items-center gap-1 transition-colors"
                disabled={isLocked}
              >
                ← Back
              </button>
            )}
            <h2
              className="font-heading text-[1.6rem] text-white leading-tight"
              style={{ color: step === 'success' ? 'var(--pm-moon)' : undefined }}
            >
              {stepTitles[step]}
            </h2>
          </div>
          {!isLocked && (
            <button
              onClick={onClose}
              className="text-2xl leading-none text-white/40 hover:text-white transition-colors flex-shrink-0 ml-4"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div key="form" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                <FormStep
                  form={form}
                  onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
                  target={target}
                  totalDeposit={totalDeposit}
                  balancePerPerson={balancePerPerson}
                  onSubmit={handleFormSubmit}
                />
              </motion.div>
            )}

            {step === 'summary' && (
              <motion.div key="summary" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                <SummaryStep
                  form={form}
                  target={target}
                  selectedPkg={selectedPkg}
                  totalDeposit={totalDeposit}
                  balancePerPerson={balancePerPerson}
                  loading={intentLoading}
                  error={intentError}
                  onConfirm={handleContinueToPayment}
                  onBack={() => setStep('form')}
                />
              </motion.div>
            )}

            {step === 'card' && clientSecret && (
              <motion.div key="card" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                <Elements stripe={stripePromise}>
                  <CardStep
                    clientSecret={clientSecret}
                    form={form}
                    totalDeposit={totalDeposit}
                    onSuccess={() => setStep('success')}
                    onBack={() => setStep('summary')}
                  />
                </Elements>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                <SuccessStep
                  destination={target.destination}
                  date={target.date}
                  totalDeposit={totalDeposit}
                  onClose={onClose}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ── Step 1: Form ─────────────────────────────────────────────── */

interface FormStepProps {
  form: FormValues
  onChange: (patch: Partial<FormValues>) => void
  target: BookingTarget
  totalDeposit: number
  balancePerPerson: number
  onSubmit: (e: React.FormEvent) => void
}

function FormStep({ form, onChange, target, totalDeposit, balancePerPerson, onSubmit }: FormStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name">
          <input className={input} type="text" required placeholder="First name"
            value={form.firstName} onChange={(e) => onChange({ firstName: e.target.value })} />
        </Field>
        <Field label="Last name">
          <input className={input} type="text" required placeholder="Last name"
            value={form.lastName} onChange={(e) => onChange({ lastName: e.target.value })} />
        </Field>
      </div>

      <Field label="Email address">
        <input className={input} type="email" required placeholder="your@email.com"
          value={form.email} onChange={(e) => onChange({ email: e.target.value })} />
      </Field>

      <Field label="Phone number">
        <input className={input} type="tel" placeholder="+44 7700 000000"
          value={form.phone} onChange={(e) => onChange({ phone: e.target.value })} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Weekend">
          <input className={input} type="text" value={target.date} readOnly />
        </Field>
        <Field label="Package">
          <select className={input} value={form.pkgValue} style={{ background: 'var(--pm-navy)' }}
            onChange={(e) => onChange({ pkgValue: Number(e.target.value) })}>
            {PACKAGES.map((p) => (
              <option key={p.value} value={p.value} style={{ background: 'var(--pm-navy)' }}>
                {p.label} — from £{p.value.toLocaleString()} pp
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Number of guests">
        <select className={input} value={form.partySize} style={{ background: 'var(--pm-navy)' }}
          onChange={(e) => onChange({ partySize: Number(e.target.value) })}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n} style={{ background: 'var(--pm-navy)' }}>
              {n} {n === 1 ? 'guest' : 'guests'}
            </option>
          ))}
          <option value={7} style={{ background: 'var(--pm-navy)' }}>7+ guests — we&apos;ll be in touch</option>
        </select>
      </Field>

      <Field label="Any special requests or occasions?">
        <input className={input} type="text" placeholder="Birthday, anniversary, dietary requirements…"
          value={form.specialRequests} onChange={(e) => onChange({ specialRequests: e.target.value })} />
      </Field>

      <DepositBox totalDeposit={totalDeposit} partySize={form.partySize} balancePerPerson={balancePerPerson} />

      <button type="submit" className={primaryBtn}>
        Review booking
      </button>
    </form>
  )
}

/* ── Step 2: Summary ──────────────────────────────────────────── */

interface SummaryStepProps {
  form: FormValues
  target: BookingTarget
  selectedPkg: { label: string; value: number }
  totalDeposit: number
  balancePerPerson: number
  loading: boolean
  error: string
  onConfirm: () => void
  onBack: () => void
}

function SummaryStep({
  form, target, selectedPkg, totalDeposit, balancePerPerson, loading, error, onConfirm, onBack,
}: SummaryStepProps) {
  const rows = [
    ['Trip', target.destination],
    ['Date', target.date],
    ['Guests', `${form.partySize} ${form.partySize === 1 ? 'guest' : 'guests'}`],
    ['Package', `${selectedPkg.label} (£${selectedPkg.value.toLocaleString()} pp from)`],
    ['Name', `${form.firstName} ${form.lastName}`],
    ['Email', form.email],
    ...(form.phone ? [['Phone', form.phone]] : []),
    ...(form.specialRequests ? [['Requests', form.specialRequests]] : []),
  ]

  return (
    <div className="space-y-6">
      <p className="text-[0.75rem] tracking-[0.05em] leading-[2] text-white/50">
        Please review your details before entering payment.
      </p>

      <dl
        className="rounded-[2px] overflow-hidden divide-y"
        style={{ border: '1px solid var(--pm-glass-border)', borderColor: 'var(--pm-glass-border)' }}
      >
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start px-5 py-3">
            <dt className="w-28 flex-shrink-0 text-[0.6rem] tracking-[0.15em] uppercase text-white/40 pt-px">
              {label}
            </dt>
            <dd className="text-[0.8rem] text-white">{value}</dd>
          </div>
        ))}
      </dl>

      <DepositBox totalDeposit={totalDeposit} partySize={form.partySize} balancePerPerson={balancePerPerson} />

      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[0.7rem] leading-relaxed"
            style={{ color: '#f09595' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        onClick={onConfirm}
        disabled={loading}
        className={`${primaryBtn} disabled:opacity-60`}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span key="loading" className="flex items-center justify-center gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Spinner /> Preparing payment…
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Continue to payment →
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}

/* ── Step 3: Card ─────────────────────────────────────────────── */

interface CardStepProps {
  clientSecret: string
  form: FormValues
  totalDeposit: number
  onSuccess: () => void
  onBack: () => void
}

function CardStep({ clientSecret, form, totalDeposit, onSuccess, onBack }: CardStepProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setStatus('loading')
    setErrorMessage('')

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          ...(form.phone ? { phone: form.phone } : {}),
        },
      },
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message ?? 'Your payment could not be processed. Please try again.')
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess()
    } else {
      setStatus('error')
      setErrorMessage('Payment status unclear. Please contact us to confirm your booking.')
    }
  }

  const isLoading = status === 'loading'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className="rounded-[2px] p-4"
        style={{ background: 'rgba(var(--pm-purple-rgb),0.07)', border: '1px solid rgba(var(--pm-purple-rgb),0.2)' }}
      >
        <p className="text-[0.6rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--pm-purple-light)' }}>
          Amount to charge today
        </p>
        <p className="font-heading text-2xl text-white">£{totalDeposit.toLocaleString()}</p>
        <p className="text-[0.65rem] text-white/40 mt-1">Reservation deposit · fully secure via Stripe</p>
      </div>

      {/* Card element container */}
      <div>
        <label className="block text-[0.6rem] tracking-[0.2em] uppercase text-white/50 mb-3">
          Card details
        </label>
        <div
          className="px-4 py-[14px] rounded-[2px] transition-colors"
          style={{
            background: 'var(--pm-navy)',
            border: '1px solid var(--pm-glass-border)',
          }}
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[0.7rem] leading-relaxed"
            style={{ color: '#f09595' }}
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={!stripe || isLoading} className={`${primaryBtn} disabled:opacity-60`}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span key="loading" className="flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}>
              <Spinner /> Processing…
            </motion.span>
          ) : (
            <motion.span key="idle"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}>
              Pay £{totalDeposit.toLocaleString()} — secure my place
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <p className="text-center text-[0.6rem] tracking-[0.05em] text-white/30">
        Secured by Stripe · TLS encrypted · No card details stored by Partymoon
      </p>
    </form>
  )
}

/* ── Step 4: Success ──────────────────────────────────────────── */

function SuccessStep({
  destination, date, totalDeposit, onClose,
}: { destination: string; date: string; totalDeposit: number; onClose: () => void }) {
  return (
    <div className="py-4 text-center space-y-5">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mx-auto flex size-16 items-center justify-center rounded-full"
        style={{ background: 'rgba(var(--pm-purple-rgb),0.15)', border: '1px solid var(--pm-purple)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="var(--pm-purple-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>

      <div>
        <p className="font-heading text-[1.8rem] font-light text-white mb-2">
          You&apos;re going to <span style={{ color: 'var(--pm-moon)' }}>{destination}</span>
        </p>
        <p className="text-[0.75rem] tracking-[0.05em] leading-[2] text-white/50 max-w-sm mx-auto">
          Your £{totalDeposit.toLocaleString()} deposit has been charged. A receipt from Stripe is
          on its way to your inbox along with your booking confirmation.
        </p>
      </div>

      <div
        className="rounded-[2px] px-6 py-4 text-left text-[0.7rem] leading-[2] space-y-1 text-white/50"
        style={{ background: 'var(--pm-glass)', border: '1px solid var(--pm-glass-border)' }}
      >
        <p><span className="text-white">Trip:</span> {destination} · {date}</p>
        <p><span className="text-white">What happens next:</span> Your full itinerary arrives 2 weeks before departure.</p>
        <p>Balance due 8 weeks before travel. We&apos;ll send a reminder.</p>
      </div>

      <button onClick={onClose} className="text-[0.65rem] tracking-[0.2em] uppercase font-bold px-8 py-3 border text-white rounded-[2px] transition-colors hover:border-white/40"
        style={{ borderColor: 'var(--pm-glass-border)' }}>
        Close
      </button>
    </div>
  )
}

/* ── Shared sub-components ────────────────────────────────────── */

function DepositBox({
  totalDeposit, partySize, balancePerPerson,
}: { totalDeposit: number; partySize: number; balancePerPerson: number }) {
  return (
    <div className="rounded-[2px] p-4" style={{ background: 'rgba(var(--pm-purple-rgb),0.08)', border: '1px solid rgba(var(--pm-purple-rgb),0.25)' }}>
      <p className="text-[0.6rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--pm-purple-light)' }}>
        Reservation deposit today
      </p>
      <p className="font-heading text-2xl text-white">
        £{totalDeposit.toLocaleString()}
        {partySize > 1 && (
          <span className="font-sans text-[0.65rem] font-light text-white/40 ml-2">
            (£{DEPOSIT_PER_PERSON} × {partySize} guests)
          </span>
        )}
      </p>
      <p className="text-[0.65rem] text-white/40 mt-1">
        Balance of £{balancePerPerson.toLocaleString()} pp due 8 weeks before travel.
      </p>
    </div>
  )
}

function Spinner() {
  return (
    <motion.span
      className="inline-block size-3 rounded-full"
      style={{ border: '1.5px solid rgba(255,255,255,0.35)', borderTopColor: 'transparent' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
    />
  )
}

/* ── Shared style primitives ──────────────────────────────────── */

const input =
  'w-full px-4 py-3 rounded-[2px] text-[0.75rem] text-white bg-transparent outline-none transition-colors disabled:opacity-50'

// Buttons that use primaryBtn must supply the background via inline style or Tailwind
// to work with AnimatePresence children. The purple bg is applied inline.
const primaryBtn =
  'w-full py-4 rounded-[2px] text-[0.65rem] tracking-[0.2em] uppercase font-medium transition-opacity [background:var(--pm-purple)] [color:var(--pm-midnight)]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.6rem] tracking-[0.2em] uppercase text-white/50 mb-2">
        {label}
      </label>
      <div style={{ background: 'var(--pm-navy)', border: '1px solid var(--pm-glass-border)', borderRadius: '2px' }}>
        {children}
      </div>
    </div>
  )
}
