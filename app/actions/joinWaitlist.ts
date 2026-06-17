'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { waitlistEntries } from '@/lib/db/schema'

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  name: z.string().optional(),
})

export type JoinWaitlistResult =
  | { success: true }
  | { success: false; error: string }

export async function joinWaitlist(
  data: z.infer<typeof schema>,
): Promise<JoinWaitlistResult> {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  }

  const { email, name } = parsed.data

  // 1. Write to Drizzle — this is the source of truth.
  //    A duplicate email (unique constraint) is treated as a silent success;
  //    the email is already on the list, which is the desired outcome.
  try {
    await db.insert(waitlistEntries).values({
      email,
      source: 'website-waitlist',
      subscribed: true,
    }).onConflictDoNothing()
  } catch (err: unknown) {
    console.error('[joinWaitlist] DB write failed:', err)
    return {
      success: false,
      error: 'Something went wrong. Please try again or contact us directly.',
    }
  }

  // 2. Sync to Loops. Failure here is non-blocking — the DB write already
  //    succeeded and the user will see the success state regardless.
  if (process.env.LOOPS_API_KEY) {
    try {
      const [firstName, ...rest] = (name ?? '').trim().split(' ')
      const lastName = rest.join(' ') || undefined

      const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          source: 'partymoon-waitlist',
          subscribed: true,
        }),
      })

      if (!res.ok) {
        console.error('[joinWaitlist] Loops sync failed:', res.status, await res.text())
      }
    } catch (err) {
      console.error('[joinWaitlist] Loops sync error:', err)
    }
  } else {
    console.warn('[joinWaitlist] LOOPS_API_KEY is not set — skipping Loops sync.')
  }

  return { success: true }
}
