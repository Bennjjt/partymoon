import { getPayload } from 'payload'
import config from '@payload-config'
import { type Trip, type CoverImage, getGradient } from '@/lib/data/trips'

// Wraps a promise with a hard timeout. Rejects with a typed error so
// callers can distinguish CMS timeout from other failures.
function withCmsTimeout<T>(promise: Promise<T>, ms = 25_000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`CMS connection timed out after ${ms}ms`)), ms),
    ),
  ])
}

// ── Result types ──────────────────────────────────────────────────

export type TripsResult =
  | { status: 'ok'; trips: Trip[] }
  | { status: 'degraded'; error: string }

export type TripResult =
  | { status: 'ok'; trip: Trip }
  | { status: 'not_found' }
  | { status: 'degraded'; error: string }

// ── Mapping helpers ───────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCoverImage(img: any): CoverImage | null {
  if (!img || typeof img !== 'object' || !img.url) return null
  return {
    url: img.url as string,
    alt: (img.alt as string) ?? '',
    width: (img.width as number) ?? null,
    height: (img.height as number) ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTrip(doc: any): Trip {
  const gallery = Array.isArray(doc.gallery)
    ? (doc.gallery as any[])
        .map((item) => {
          const image = toCoverImage(item.image)
          const videoUrl = (item.videoUrl as string) || null
          if (!image && !videoUrl) return null
          return { id: item.id as string | undefined, image, videoUrl, caption: (item.caption as string) ?? null }
        })
        .filter(Boolean) as Trip['gallery']
    : undefined

  return {
    id: String(doc.id),
    title: doc.title ?? '',
    destination: doc.destination ?? '',
    slug: doc.slug ?? '',
    gradient: getGradient(doc.slug ?? ''),
    coverImage: toCoverImage(doc.coverImage),
    startDate: doc.startDate ?? '',
    endDate: doc.endDate ?? '',
    hotel: doc.hotel ?? null,
    clubNights: doc.clubNights ?? null,
    includes: doc.includes ?? null,
    spotsTotal: doc.spotsTotal ?? 25,
    spotsTaken: doc.spotsTaken ?? 0,
    priceFrom: doc.priceFrom ?? 0,
    deposit: doc.deposit ?? 0,
    showMap: Boolean(doc.showMap),
    latitude: doc.latitude ?? null,
    longitude: doc.longitude ?? null,
    heroTagline: doc.heroTagline ?? null,
    introText: doc.introText ?? undefined,
    inclusions: Array.isArray(doc.inclusions) ? doc.inclusions : undefined,
    clubs: Array.isArray(doc.clubs) ? doc.clubs : undefined,
    hotelOptions: Array.isArray(doc.hotelOptions) ? doc.hotelOptions : undefined,
    signatureExperience: doc.signatureExperience ?? undefined,
    spa: doc.spa ?? undefined,
    diningExperiences: Array.isArray(doc.diningExperiences) ? doc.diningExperiences : undefined,
    hosts: Array.isArray(doc.hosts) ? doc.hosts : undefined,
    summary: doc.summary ?? undefined,
    itinerary: Array.isArray(doc.itinerary) ? doc.itinerary : undefined,
    gallery,
  }
}

// ── Queries ───────────────────────────────────────────────────────

export async function getPublishedTrips(destSlug?: string): Promise<TripsResult> {
  try {
    const payload = await withCmsTimeout(getPayload({ config }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {}
    if (destSlug) where.slug = { equals: destSlug }
    const { docs } = await withCmsTimeout(
      payload.find({
        collection: 'trips',
        where: Object.keys(where).length ? where : undefined,
        sort: 'startDate',
        depth: 1,
        limit: 100,
        overrideAccess: true,
      }),
    )
    return { status: 'ok', trips: docs.map(toTrip) }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[CMS] getPublishedTrips failed:', message)
    return { status: 'degraded', error: message }
  }
}

export async function getTripBySlug(slug: string): Promise<TripResult> {
  try {
    const payload = await withCmsTimeout(getPayload({ config }))
    const { docs } = await withCmsTimeout(
      payload.find({
        collection: 'trips',
        where: { slug: { equals: slug } },
        depth: 2,
        limit: 1,
        overrideAccess: true,
      }),
    )
    if (!docs.length) return { status: 'not_found' }
    return { status: 'ok', trip: toTrip(docs[0]) }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[CMS] getTripBySlug failed for slug "%s":', slug, message)
    return { status: 'degraded', error: message }
  }
}
