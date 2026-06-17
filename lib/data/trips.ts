import type { PortableTextBlock } from 'next-sanity'

export interface CoverImage {
  url: string
  alt: string
  width: number | null
  height: number | null
}

// ── Sub-types for detail page fields ──────────────────────────────

export interface TripInclusion {
  id?: string
  icon?: string | null
  title: string
  sub?: string | null
  detail?: string | null
}

export interface TripClub {
  id?: string
  badge?: string | null
  name: string
  vibe?: string | null
  description?: string | null
}

export interface TripHotelOption {
  id?: string
  tier?: string | null
  name: string
  location?: string | null
  features?: Array<{ id?: string; feature: string }>
}

export interface SignatureExperienceStat {
  id?: string
  label: string
  value: string
  tag?: string | null
}

export interface SignatureExperience {
  eyebrow?: string | null
  heading?: string | null
  description?: PortableTextBlock[]
  stats?: SignatureExperienceStat[]
}

export interface TripSpa {
  eyebrow?: string | null
  heading?: string | null
  subheading?: string | null
  description?: string | null
  features?: Array<{ id?: string; feature: string }>
}

export interface TripDiningExperience {
  id?: string
  nightLabel?: string | null
  title: string
  description?: string | null
}

export interface TripHost {
  id?: string
  icon?: string | null
  role?: string | null
  name?: string | null
  bio?: string | null
}

// ── Main Trip type ────────────────────────────────────────────────

export interface Trip {
  id: string
  title: string
  destination: string
  slug: string
  gradient: string
  coverImage: CoverImage | null
  startDate: string
  endDate: string
  hotel: string | null
  clubNights: string | null
  includes: string | null
  spotsTotal: number
  spotsTaken: number
  priceFrom: number  // pounds
  deposit: number    // pounds
  showMap?: boolean
  latitude?: number | null
  longitude?: number | null

  // Detail page fields
  heroTagline?: string | null
  introText?: PortableTextBlock[]
  inclusions?: TripInclusion[]
  clubs?: TripClub[]
  hotelOptions?: TripHotelOption[]
  signatureExperience?: SignatureExperience
  spa?: TripSpa
  diningExperiences?: TripDiningExperience[]
  hosts?: TripHost[]
  summary?: PortableTextBlock[]
  itinerary?: Array<{
    id?: string
    tag?: string | null
    day: number
    title: string
    description?: string | null
  }>
  gallery?: Array<{
    id?: string
    image: CoverImage | null
    videoUrl?: string | null
    caption?: string | null
  }>
}

// ── Helpers ───────────────────────────────────────────────────────

export function getTripAvailability(trip: Trip): 'available' | 'sold-out' {
  return trip.spotsTaken >= trip.spotsTotal ? 'sold-out' : 'available'
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const dayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric' })
  const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(end)
  return `${dayFmt.format(start)} – ${dayFmt.format(end)} ${monthYear}`
}

export function formatPrice(pounds: number): string {
  return `£${pounds.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

// ── Fallback gradients ────────────────────────────────────────────

const GRADIENTS: Record<string, string> = {
  ibiza:    'linear-gradient(160deg,#2a1548 0%,#1a2a50 50%,#121830 100%)',
  mykonos:  'linear-gradient(160deg,#102040 0%,#1a3020 50%,#102020 100%)',
  monaco:   'linear-gradient(160deg,#251808 0%,#351a08 50%,#221010 100%)',
  marbella: 'linear-gradient(160deg,#280808 0%,#381212 50%,#220a22 100%)',
  cannes:   'linear-gradient(160deg,#081a1a 0%,#183018 50%,#081820 100%)',
  amalfi:   'linear-gradient(160deg,#081808 0%,#183020 50%,#081028 100%)',
  amsterdam:  'linear-gradient(160deg,#0d0820 0%,#1a0d35 50%,#0a0818 100%)',
  copenhagen: 'linear-gradient(160deg,#081828 0%,#102238 50%,#081420 100%)',
  berlin:     'linear-gradient(160deg,#101010 0%,#1a1a22 50%,#0a0a10 100%)',
  barcelona:  'linear-gradient(160deg,#280818 0%,#381220 50%,#200810 100%)',
}

const DEFAULT_GRADIENT = 'linear-gradient(160deg,#1a1535 0%,#0d1a35 50%,#0d0d28 100%)'

export function getGradient(slug: string): string {
  return GRADIENTS[slug.toLowerCase()] ?? DEFAULT_GRADIENT
}
