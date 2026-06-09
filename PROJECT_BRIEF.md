# PartyMoon — Project Brief & Agent Handoff

**Last updated:** May 2026  
**Purpose:** Context document for any agent picking up this codebase. Read this before writing any code.

---

## What this project is

PartyMoon is a group travel booking website for European VIP weekend trips. Guests browse curated trips (Ibiza, Mykonos, Monaco, Marbella, Cannes, Amalfi Coast), reserve a spot with a £300-per-person deposit paid via Stripe, and receive a full itinerary managed through Payload CMS. There is also a women-only sub-brand called **Silk Soiree**. The site is dark, luxury-styled; the reference design is in `partymoon (1).html` at the project root.

---

## Tech stack

| Layer | Package | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.2.5 | App Router, Turbopack in dev |
| CMS | Payload | 3.84.1 | Embedded in the same Next.js app |
| Database | Neon Postgres | — | Via `@payloadcms/db-postgres` |
| Styling | Tailwind | v4 | CSS custom properties token system |
| Components | shadcn/ui | 4.7.x | **base-ui backed** — not Radix |
| Animation | Framer Motion | 12.38.0 | **Only** animation system — no CSS keyframes |
| Payments | Stripe | 22.1.1 + react-stripe-js 6.3.0 | API version `2026-04-22.dahlia` |
| Email | Loops | — | Via REST API, no SDK |
| Forms | React Hook Form 7 + Zod 4 | — | `@hookform/resolvers` v5 |
| Language | TypeScript | 5.x strict | |

---

## Running the project

```bash
npm install
npm run dev        # starts on :3000 (Turbopack)
npm run build      # production build
npm run lint       # ESLint
npm run format     # Prettier
```

The app will start without a database connected, but the Payload admin at `/admin` will error. Set `DATABASE_URL` to a Neon connection string to unlock CMS functionality.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
DATABASE_URL              Neon Postgres connection string
PAYLOAD_SECRET            Random 32-char string (openssl rand -hex 32)
STRIPE_SECRET_KEY         sk_test_... or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  pk_test_... or pk_live_...
STRIPE_WEBHOOK_SECRET     whsec_... from Stripe dashboard → Webhooks
LOOPS_API_KEY             loops_... from Loops dashboard → Settings → API Keys
NEXT_PUBLIC_SITE_URL      http://localhost:3000 in dev; deployed URL in prod
```

---

## Project structure

```
app/
  (payload)/                   Payload admin + REST API routes (catch-all)
  actions/
    createPaymentIntent.ts     Server action — creates Stripe PaymentIntent + pending Booking
    joinWaitlist.ts            Server action — writes to Payload then syncs to Loops
  api/webhooks/stripe/
    route.ts                   Stripe webhook: payment_intent.succeeded → confirms Booking
  globals.css                  Tailwind base + shadcn tokens + pm colour tokens
  theme.css                    Design tokens (--pm-* CSS custom properties)
  layout.tsx                   Root layout — fonts (Montserrat + Cormorant Garamond), BookingProvider
  page.tsx                     Homepage — async server component, reads ?dest= searchParam

components/
  blocks/                      Page sections
    Hero.tsx                   Client — Framer Motion entrance, star field
    DestinationStrip.tsx       Client — URL-driven filter pills (useSearchParams)
    TripGrid.tsx               Client — stagger reveal container for trip cards
    TripsSection.tsx           Server — section wrapper, uses TripGrid
    TripCard.tsx               Client — next/image or gradient fallback, opens BookingModal
    PackagesSection.tsx        Client — 3-tier pricing with stagger reveal
    HowItWorks.tsx             Server — 4-step process, RevealOnScroll per step
    SilkSoiree.tsx             Client — women-only sub-brand section
    Testimonials.tsx           Server — 3 review cards, RevealOnScroll per card
    WaitlistSection.tsx        Client — form wired to joinWaitlist server action
    CTABanner.tsx              Generic reusable CTA (not on homepage, kept for future pages)
    FeatureGrid.tsx            Generic reusable feature grid (same)
  layout/
    Navbar.tsx                 Client — scroll-aware glass blur via Framer Motion animate
    Footer.tsx                 Server
  providers/
    BookingProvider.tsx        Client — React context for booking modal state; wraps layout
  ui/
    BookingModal.tsx           Client — 4-step modal: form → summary → Stripe card → success
    RevealOnScroll.tsx         Client — thin motion.div wrapper for scroll reveal on server components
    button.tsx                 shadcn button (base-ui backed — see gotcha below)

lib/
  data/trips.ts                Static trip data + Trip/CoverImage types
  stripe.ts                    Server Stripe singleton (throws if STRIPE_SECRET_KEY unset)
  stripe-client.ts             loadStripe promise for client-side Elements
  utils.ts                     shadcn cn() utility

payload/
  collections/
    Users.ts                   Auth-enabled users
    Media.ts                   Upload collection for trip photos etc.
    BlogPosts.ts               title, slug, coverImage, body (richtext), publishedAt
    Trips.ts                   title, slug, destination, coverImage, summary, price, deposit,
                               itinerary (array), gallery (array), status
    Bookings.ts                customerName, customerEmail, tripId (relationship), partySize,
                               depositAmount (pence), paymentIntentId, status (pending/confirmed/cancelled)
    WaitlistEntry.ts           email (unique), source, subscribed (boolean)
  views/
    BookingsView.tsx           Custom Payload admin view at /admin/bookings
  components/
    BookingsNavLink.tsx        Client — sidebar nav link for the bookings view

payload.config.ts              Payload config — all collections registered, custom views registered
```

---

## Design system

### Fonts
- **Heading:** Cormorant Garamond (serif) — loaded via `next/font/google`, CSS var `--font-cormorant`
- **Body:** Montserrat (sans-serif) — loaded as `--font-sans`, replaces Geist

### Colour tokens
All design tokens live in `app/theme.css` as `--pm-*` CSS custom properties. They are mapped to Tailwind utilities in `app/globals.css` under `@theme inline`. Use these, not hardcoded hex values.

```
--pm-midnight    #0f0f1e   Page background
--pm-deep        #161628   Card/panel surface
--pm-navy        #1e1e38   Input/elevated surface
--pm-purple      #6B5FCC   Primary accent
--pm-purple-light #9B8FED  Eyebrows, muted labels
--pm-moon        #ddd0ff   Logo wordmark
--pm-gold        #f2d878   Silk Soiree accent
--pm-gold-dim    #c9a84c   Silk Soiree borders
--pm-glass       rgba(255,255,255,0.07)   Glass surface
--pm-glass-border rgba(255,255,255,0.14)  Glass border
```

Tailwind usage: `bg-pm-midnight`, `text-pm-purple`, `border-pm-glass-border` etc.

### Radius
All corners use `rounded-[2px]` — the design calls for sharp, minimal rounding throughout.

---

## Animation rules (important)

**All animations must use Framer Motion. No CSS `@keyframes` anywhere.**

- Hero entrance: `motion.*` with `initial`/`animate`/`transition` — already implemented, do not touch
- Scroll reveal: `RevealOnScroll` wrapper component or `motion.div` with `whileInView` + `viewport={{ once: true }}`
- Stagger grids: parent `motion.div` with `variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}` + `whileInView="visible"` — children use `variants={cardVariants}`
- Hover lifts: `whileHover={{ y: -4 }}` on `motion.div`/`motion.article`
- Navbar scroll: `motion.nav` with `animate={{ backgroundColor, paddingTop, paddingBottom }}`
- Spinner: `motion.span` with `animate={{ rotate: 360 }}` + `repeat: Infinity`

---

## Known gotchas

**shadcn Button has no `asChild` prop.**
The installed shadcn uses `@base-ui/react` instead of Radix. Never use `<Button asChild><Link>`. Instead, apply `buttonVariants()` directly to the `<Link>`:
```tsx
import { buttonVariants } from '@/components/ui/button'
<Link href="/trips" className={buttonVariants({ size: 'lg' })}>Browse</Link>
```

**Next.js is v16, not v15.**
`create-next-app` installed 16.2.5. Payload v3 peer deps target `^15` but installed fine. Do not downgrade.

**Payload admin API imports.**
`DefaultTemplate` is at `@payloadcms/next/templates` (not `/views`). `HydrateClientUser` does not exist in Payload 3.84. Admin view components use `AdminViewServerProps` from `payload`, and the `payload` instance is available directly on props (from `ServerProps` mixin), not via `initPageResult.req.payload`.

**Zod v4 + hookform/resolvers v5.**
`zodResolver(schema)` requires `as any` or `as unknown` to satisfy the strict type overlap. See `components/forms/FormWrapper.tsx`.

**Stripe API version.**
stripe@22.1.1 pins to `'2026-04-22.dahlia'`. Always use this string in the Stripe constructor — the TypeScript types won't accept older version strings.

**`tripId` in Bookings is not wired.**
`createPaymentIntent.ts` creates Bookings without `tripId` because we're using static trip data (no real Payload document IDs). There is a `// TODO` comment. When trips are managed through Payload, query the trip by slug in the server action and pass the document ID.

**Static trip data.**
`lib/data/trips.ts` holds 6 hardcoded trips with `coverImage: null`. This is the data source for the homepage. When trips move to Payload, replace the `TRIPS` import in `app/page.tsx` with a `payload.find()` call and pass the real Payload trip document ID to the booking flow.

**Loops sync is non-blocking.**
In `joinWaitlist.ts`, the Loops API call is wrapped in its own try/catch after the Payload write. Loops failure never surfaces to the user and never rolls back the Payload write.

---

## Data flows

### Booking flow
1. User clicks "Reserve your place" on a TripCard → `BookingProvider` opens `BookingModal`
2. Step 1 (form): user fills name, email, phone, package, guests
3. Step 2 (summary): user reviews details, clicks "Continue to payment"
4. `createPaymentIntent` server action fires:
   - Creates a Stripe `PaymentIntent` (amount = £300 × guests in pence)
   - Writes a `Bookings` document with `status: 'pending'` and `paymentIntentId`
   - Returns `clientSecret` to client
5. Step 3 (card): `<Elements stripe={stripePromise}>` wraps `<CardElement>`; user enters card
6. `stripe.confirmCardPayment(clientSecret, { payment_method: { card: cardElement } })`
7. On success → Step 4 (confirmation shown to user)
8. Stripe fires `payment_intent.succeeded` webhook to `POST /api/webhooks/stripe`
9. Webhook verifies signature, finds Booking by `paymentIntentId`, updates `status: 'confirmed'`

### Waitlist flow
1. User submits name + email in `WaitlistSection`
2. `joinWaitlist` server action fires:
   - Writes to `WaitlistEntry` Payload collection (source of truth; duplicate email = silent success)
   - POSTs to `https://app.loops.so/api/v1/contacts/create` (non-blocking, skipped if `LOOPS_API_KEY` unset)
3. User sees success confirmation regardless of Loops outcome

### Destination filtering
1. User clicks a pill in `DestinationStrip` → `router.push('?dest=ibiza', { scroll: false })`
2. `app/page.tsx` (async server component) reads `searchParams.dest`
3. Filters `TRIPS` array by `trip.slug === dest`; passes result to `<TripsSection trips={filtered} />`

---

## Payload admin

- **URL:** `/admin`
- **Custom view:** `/admin/bookings` — table of all bookings (name, email, trip, party size, deposit, date, status)
- **Collections:** Users, Media, BlogPosts, Trips, Bookings, WaitlistEntry
- **Auth:** Payload's built-in email/password auth; Users collection
- **Custom nav link:** `BookingsNavLink` registered in `afterNavLinks` (sidebar)
- **Import map:** `app/(payload)/importMap.ts` — must be updated whenever a new custom Payload component is added

---

## What is not yet built

- **Real Payload trip data.** All trips are static. The Payload `Trips` collection is schema-ready but has no entries. When content is added through Payload admin, replace `lib/data/trips.ts` with a server-side `payload.find()` in `page.tsx` and wire the Payload document ID through to the booking flow.
- **Trip photography.** `coverImage: null` on all static trips. Gradient placeholders ship at launch. See `DECISIONS.md` item 5 for the process to add images.
- **Revenue dashboard** (`/admin/revenue`) — future scope, tracked in `DECISIONS.md` item 3a.
- **Guest CRM** — future scope, tracked in `DECISIONS.md` item 3b.
- **Blog** — `BlogPosts` collection exists in Payload but no frontend routes are built.
- **Individual trip pages** — no `/trips/[slug]` route exists yet.
- **Authentication UI** — Navbar has a "Sign in" link pointing to `/login` which doesn't exist.
- **Corporate bookings** — Footer links to `/contact` which doesn't exist.

---

## Key files to read before making changes

| File | Why |
|---|---|
| `DECISIONS.md` | All architecture decisions with rationale — read before changing any resolved item |
| `app/theme.css` | All colour/font/radius tokens — edit here to retheme |
| `lib/data/trips.ts` | Static trip data and type definitions |
| `payload.config.ts` | All Payload collections and custom admin components registered here |
| `app/(payload)/importMap.ts` | Must be updated when adding Payload custom components |
| `payload/collections/Bookings.ts` | Booking schema — note the tripId TODO |
| `app/actions/createPaymentIntent.ts` | Payment + Payload write — has the tripId TODO |
| `CLAUDE.md` | BEARA-wide conventions (email provider etc.) |
