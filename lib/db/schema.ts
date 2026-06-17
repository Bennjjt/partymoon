import { pgTable, text, boolean, integer, timestamp, uuid } from 'drizzle-orm/pg-core'

export const waitlistEntries = pgTable('waitlist_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  source: text('source').notNull().default('website-waitlist'),
  subscribed: boolean('subscribed').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  // Sanity document _id (e.g. "trip-ibiza-2026"); text not a FK
  tripId: text('trip_id'),
  partySize: integer('party_size').notNull(),
  // Deposit total in pence (GBP)
  depositAmount: integer('deposit_amount').notNull(),
  paymentIntentId: text('payment_intent_id').notNull().unique(),
  status: text('status', { enum: ['pending', 'confirmed', 'cancelled'] })
    .notNull()
    .default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type WaitlistEntry = typeof waitlistEntries.$inferSelect
export type NewWaitlistEntry = typeof waitlistEntries.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
