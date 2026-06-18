import { defineQuery } from 'next-sanity'
import { client } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/image'
import { type Trip, type CoverImage, getGradient } from '@/lib/data/trips'

// ── Timeout wrapper ───────────────────────────────────────────────
// Keeps the same degraded-state behaviour as the Payload implementation.
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

// ── Image fragment ────────────────────────────────────────────────
const imageFragment = /* groq */ `
  asset->{ _id, url, metadata { dimensions { width, height } } },
  alt,
  hotspot,
  crop
`

// ── GROQ queries ──────────────────────────────────────────────────
const TRIPS_LIST_QUERY = defineQuery(/* groq */ `
  *[
    _type == "trip"
    && status == "published"
    && defined(slug.current)
  ] | order(startDate asc) {
    _id,
    title,
    destination,
    "slug": slug.current,
    startDate,
    endDate,
    hotel,
    clubNights,
    includes,
    spotsTotal,
    spotsTaken,
    priceFrom,
    deposit,
    coverImage {
      ${imageFragment}
    }
  }
`)

const TRIP_DETAIL_QUERY = defineQuery(/* groq */ `
  *[
    _type == "trip"
    && slug.current == $slug
    && status == "published"
  ][0] {
    _id,
    title,
    destination,
    "slug": slug.current,
    startDate,
    endDate,
    hotel,
    clubNights,
    includes,
    spotsTotal,
    spotsTaken,
    priceFrom,
    deposit,
    showMap,
    latitude,
    longitude,
    heroTagline,
    introText,
    introImages[] {
      ${imageFragment}
    },
    summary,
    coverImage {
      ${imageFragment}
    },
    inclusions[] {
      _key,
      icon,
      title,
      sub,
      detail
    },
    itinerary[] {
      _key,
      tag,
      day,
      title,
      description
    },
    clubs[] {
      _key,
      badge,
      name,
      vibe,
      description
    },
    hotelOptions[] {
      _key,
      tier,
      name,
      location,
      features[] { _key, feature }
    },
    signatureExperience {
      eyebrow,
      heading,
      description,
      stats[] {
        _key,
        label,
        value,
        tag
      }
    },
    spa {
      eyebrow,
      heading,
      subheading,
      description,
      features[] { _key, feature }
    },
    diningExperiences[] {
      _key,
      nightLabel,
      title,
      description
    },
    hosts[] {
      _key,
      icon,
      role,
      name,
      bio
    },
    gallery[] {
      _key,
      image {
        ${imageFragment}
      },
      videoUrl,
      caption
    }
  }
`)

// ── Mapping helpers ───────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCoverImage(sanityImage: any): CoverImage | null {
  if (!sanityImage?.asset) return null
  const url = urlFor(sanityImage).url()
  if (!url) return null
  return {
    url,
    alt: (sanityImage.alt as string) ?? '',
    width: (sanityImage.asset?.metadata?.dimensions?.width as number) ?? null,
    height: (sanityImage.asset?.metadata?.dimensions?.height as number) ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTrip(doc: any): Trip {
  const gallery = Array.isArray(doc.gallery)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc.gallery as any[])
        .map((item) => {
          const image = toCoverImage(item.image)
          const videoUrl = (item.videoUrl as string) || null
          if (!image && !videoUrl) return null
          return {
            id: item._key as string | undefined,
            image,
            videoUrl,
            caption: (item.caption as string) ?? null,
          }
        })
        .filter(Boolean) as Trip['gallery']
    : undefined

  return {
    id: String(doc._id),
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
    introImages: Array.isArray(doc.introImages)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (doc.introImages as any[]).map(toCoverImage).filter(Boolean) as Trip['introImages']
      : undefined,
    inclusions: Array.isArray(doc.inclusions)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doc.inclusions.map((i: any) => ({
          id: i._key,
          icon: i.icon ?? null,
          title: i.title,
          sub: i.sub ?? null,
          detail: i.detail ?? null,
        }))
      : undefined,
    clubs: Array.isArray(doc.clubs)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doc.clubs.map((c: any) => ({
          id: c._key,
          badge: c.badge ?? null,
          name: c.name,
          vibe: c.vibe ?? null,
          description: c.description ?? null,
        }))
      : undefined,
    hotelOptions: Array.isArray(doc.hotelOptions)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doc.hotelOptions.map((h: any) => ({
          id: h._key,
          tier: h.tier ?? null,
          name: h.name,
          location: h.location ?? null,
          features: Array.isArray(h.features)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              h.features.map((f: any) => ({ id: f._key, feature: f.feature }))
            : [],
        }))
      : undefined,
    signatureExperience: doc.signatureExperience
      ? {
          eyebrow: doc.signatureExperience.eyebrow ?? null,
          heading: doc.signatureExperience.heading ?? null,
          description: doc.signatureExperience.description ?? undefined,
          stats: Array.isArray(doc.signatureExperience.stats)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              doc.signatureExperience.stats.map((s: any) => ({
                id: s._key,
                label: s.label,
                value: s.value,
                tag: s.tag ?? null,
              }))
            : undefined,
        }
      : undefined,
    spa: doc.spa
      ? {
          eyebrow: doc.spa.eyebrow ?? null,
          heading: doc.spa.heading ?? null,
          subheading: doc.spa.subheading ?? null,
          description: doc.spa.description ?? null,
          features: Array.isArray(doc.spa.features)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              doc.spa.features.map((f: any) => ({ id: f._key, feature: f.feature }))
            : [],
        }
      : undefined,
    diningExperiences: Array.isArray(doc.diningExperiences)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doc.diningExperiences.map((d: any) => ({
          id: d._key,
          nightLabel: d.nightLabel ?? null,
          title: d.title,
          description: d.description ?? null,
        }))
      : undefined,
    hosts: Array.isArray(doc.hosts)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doc.hosts.map((h: any) => ({
          id: h._key,
          icon: h.icon ?? null,
          role: h.role ?? null,
          name: h.name ?? null,
          bio: h.bio ?? null,
        }))
      : undefined,
    summary: doc.summary ?? undefined,
    itinerary: Array.isArray(doc.itinerary)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doc.itinerary.map((i: any) => ({
          id: i._key,
          tag: i.tag ?? null,
          day: i.day,
          title: i.title,
          description: i.description ?? null,
        }))
      : undefined,
    gallery,
  }
}

// ── Queries ───────────────────────────────────────────────────────
const fetchOptions = { next: { revalidate: 30 } }

export async function getPublishedTrips(destSlug?: string): Promise<TripsResult> {
  try {
    const docs = await withCmsTimeout(
      client.fetch(TRIPS_LIST_QUERY, {}, fetchOptions),
    )
    let trips: Trip[] = (docs ?? []).map(toTrip)
    if (destSlug) {
      trips = trips.filter((t) => t.slug === destSlug)
    }
    return { status: 'ok', trips }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[CMS] getPublishedTrips failed:', message)
    return { status: 'degraded', error: message }
  }
}

export async function getTripBySlug(slug: string): Promise<TripResult> {
  try {
    const doc = await withCmsTimeout(
      client.fetch(TRIP_DETAIL_QUERY, { slug }, fetchOptions),
    )
    if (!doc) return { status: 'not_found' }
    return { status: 'ok', trip: toTrip(doc) }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[CMS] getTripBySlug failed for slug "%s":', slug, message)
    return { status: 'degraded', error: message }
  }
}
