import { getStripe } from '@/lib/stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import type Stripe from 'stripe'

// Never cache webhook responses — each POST is a unique event
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set')
    return Response.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
  }

  // Return 200 for all other event types so Stripe doesn't retry them
  return Response.json({ received: true })
}

async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent) {
  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'bookings',
      where: { paymentIntentId: { equals: pi.id } },
      limit: 1,
      overrideAccess: true,
    })

    if (docs.length === 0) {
      console.warn(
        `[stripe-webhook] No booking found for PaymentIntent ${pi.id}. ` +
          `Booking may not have been created yet or the ID is mismatched.`,
      )
      return
    }

    await payload.update({
      collection: 'bookings',
      id: docs[0].id,
      data: { status: 'confirmed' },
      overrideAccess: true,
    })

    console.log(`[stripe-webhook] Booking ${docs[0].id} confirmed via PaymentIntent ${pi.id}`)
  } catch (err) {
    console.error('[stripe-webhook] Failed to confirm booking:', err)
    // Re-throw so Stripe sees a 500 and retries the event
    throw err
  }
}
