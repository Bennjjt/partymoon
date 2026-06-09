import { loadStripe } from '@stripe/stripe-js'

// loadStripe is safe at module level — it returns a Promise and defers
// all network activity until an Elements component mounts.
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
)
