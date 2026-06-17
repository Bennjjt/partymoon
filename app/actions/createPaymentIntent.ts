'use server'

import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { z } from 'zod'

const schema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('A valid email address is required'),
  partySize: z.number().int().min(1).max(25),
  /** Deposit total in pence (GBP). e.g. £300 × 2 guests = 60000 */
  depositAmount: z.number().int().positive(),
})

export type CreatePaymentIntentInput = z.infer<typeof schema>

export type CreatePaymentIntentResult =
  | { success: true; clientSecret: string }
  | { success: false; error: string }

export async function createPaymentIntent(
  data: CreatePaymentIntentInput,
): Promise<CreatePaymentIntentResult> {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid booking data.' }
  }

  const { tripId, name, email, partySize, depositAmount } = parsed.data

  try {
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: depositAmount,
      currency: 'gbp',
      receipt_email: email,
      metadata: {
        tripId,
        customerName: name,
        partySize: String(partySize),
      },
    })

    await db.insert(bookings).values({
      customerName: name,
      customerEmail: email,
      // tripId is a Sanity document _id string
      tripId,
      partySize,
      depositAmount,
      paymentIntentId: paymentIntent.id,
      status: 'pending',
    })

    return { success: true, clientSecret: paymentIntent.client_secret! }
  } catch (err) {
    console.error('[createPaymentIntent]', err)
    return {
      success: false,
      error: 'Failed to initialise payment. Please try again or contact us directly.',
    }
  }
}
