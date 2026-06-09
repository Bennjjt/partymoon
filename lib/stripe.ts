import Stripe from 'stripe'

// Lazy-initialised so the module can be imported without STRIPE_SECRET_KEY
// being set — the error only surfaces when stripe is actually called.
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Add it to .env.local before using Stripe functionality.',
      )
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
    })
  }
  return _stripe
}
