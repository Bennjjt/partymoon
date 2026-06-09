# PartyMoon — Open Decisions

Flags raised during the initial frontend build. Each item needs a decision before the relevant work can proceed.

---

## 1. Destination strip filtering

**Status:** ✅ Resolved — implemented with URL search params (`?dest=ibiza`)  
`DestinationStrip` is a client component that calls `useSearchParams` + `useRouter`. Active pill state is derived from the URL. `page.tsx` reads `searchParams` server-side and filters the trips array before rendering. `DestinationStrip` is wrapped in `<Suspense>` with a skeleton fallback. When Payload is wired, the filter moves to a Payload `where` query in `page.tsx` — the component layer is already structured for this.

---

## 2. Booking modal → Stripe

**Status:** ✅ Resolved — embedded card element via `@stripe/react-stripe-js`

**Modal flow (4 steps):** booking form → confirm details → card input → success confirmation

**What was built:**
- `lib/stripe.ts` — server Stripe singleton (pinned to API version `2026-04-22.dahlia`)
- `lib/stripe-client.ts` — `loadStripe` promise for client-side Elements
- `app/actions/createPaymentIntent.ts` — creates a real `PaymentIntent`, writes a `pending` Booking to Payload with the `paymentIntentId` stored for webhook lookup
- `app/api/webhooks/stripe/route.ts` — verifies `stripe-signature`, handles `payment_intent.succeeded`, updates Booking status to `confirmed` via Payload
- `components/ui/BookingModal.tsx` — fully rewritten; `Elements` provider scoped to the card step only; Framer Motion transitions between all four steps; `CardElement` styled to match the dark modal

**To activate:** set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` in `.env.local`. Register the webhook endpoint `POST /api/webhooks/stripe` in the Stripe dashboard.

**Remaining:** `tripId` on Bookings is currently omitted (no real Payload Trip IDs in the static-data world). Once trips are managed through Payload, pass the document ID from the frontend and remove the TODO in `createPaymentIntent.ts`.

---

## 3. Admin panel — bespoke UI vs. Payload admin

**Status:** ✅ Resolved — Payload admin only; bespoke HTML admin UI discarded  
The `Bookings` Payload collection is created (customerName, customerEmail, tripId relationship, partySize, depositAmount in pence, status enum). A custom Payload view is mounted at `/admin/bookings` with a server-rendered bookings table (name, email, trip, party size, deposit, date, status). A `BookingsNavLink` component is registered in `afterNavLinks` to surface the route in the admin sidebar. Revenue charts, CRM, and waitlist admin are deferred — see items 3a/3b below.

### 3a. Revenue dashboard (future scope)
A revenue summary view (monthly totals, per-trip breakdown) within the Payload admin. No decision needed now.

### 3b. Guest CRM (future scope)
Searchable guest history and contact management, likely as an extension of the Bookings list view. No decision needed now.

---

## 4. Scroll-reveal animations

**Status:** ✅ Resolved — Framer Motion `whileInView`, `viewport={{ once: true }}` on selected sections

**Applied to:**
- Trip cards — staggered grid (`staggerChildren: 0.1s`) via `TripGrid` client component; each card fades up 24px as the viewport reaches them
- Destination filter pills — fade in as a group (`opacity: 0 → 1`)
- Packages section — heading fades up, three cards stagger at 0.1s intervals; existing `whileHover` lift is preserved
- How It Works steps — heading fades up, each step staggered at 0.1s via `RevealOnScroll`
- Silk Soiree — left column fades up, right column fades up with 150ms delay (two-column stagger feel)
- Testimonial cards — each card staggered at 0.1s via `RevealOnScroll`
- Waitlist/CTA section — full inner block fades up

**Not applied to:** Hero (entrance animations unchanged), Navbar.

**Architecture:** `components/ui/RevealOnScroll.tsx` is a thin `'use client'` wrapper that server components can use as a child boundary without becoming client components themselves. Client components (`PackagesSection`, `SilkSoiree`, etc.) use `motion.div` directly.

---

## 5. Trip card images

**Status:** ✅ Implementation complete — gradient placeholders approved to ship at launch

`TripCard` renders a `next/image` when `coverImage` is populated, and falls back to the destination-specific gradient when it is `null`. `next.config.ts` has `remotePatterns` configured from `NEXT_PUBLIC_SITE_URL`. The `coverImage` field on the `Trips` Payload collection is ready and the Payload admin shows a note that it is required before a trip is considered production-ready.

**Photography decision:** Gradient placeholders ship at launch if client photography is not ready. Do not hold the launch for this. Gradients are per-destination and visually acceptable as a temporary state.

**To add photography when ready:**
1. Upload images to the Payload Media collection (set a descriptive `alt` field on each).
2. Attach the image to the relevant trip's `coverImage` field in Payload admin.
3. If serving from an external storage adapter (S3, Cloudinary, etc.), add the provider hostname to `images.remotePatterns` in `next.config.ts`.

---

## 6. Waitlist form backend

**Status:** ✅ Resolved — Payload as source of truth, Loops for audience sync

**What was built:**
- `payload/collections/WaitlistEntry.ts` — `email` (unique), `source`, `subscribed` (boolean), auto-timestamps
- `app/actions/joinWaitlist.ts` — server action that writes to Payload first, then syncs to Loops non-blockingly. Duplicate emails return success silently. Loops failure never surfaces to the user.
- `WaitlistSection.tsx` wired to the action with loading and error states
- `LOOPS_API_KEY` documented in `.env.example`
- Loops added to `CLAUDE.md` as the standard BEARA email provider
