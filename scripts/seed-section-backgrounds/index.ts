/**
 * Seed section background images for 2 non-adjacent sections on the Barcelona trip.
 *
 * Sections seeded:
 *   1. inclusionsBgImage   — "What's In It" (section 4 in page order)
 *   2. signatureExperienceBgImage — Signature Experience (section 8 in page order)
 *
 * Three sections sit between them (itinerary, clubs, hotelOptions), so they are
 * clearly non-adjacent.
 *
 * The script reuses the trip's own coverImage asset — no upload required.
 * Each section gets a different trip's cover for visual variety:
 *   - inclusionsBgImage     ← Barcelona's own cover
 *   - signatureExperienceBgImage ← Ibiza's cover (different atmosphere)
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx scripts/seed-section-backgrounds/index.ts
 *
 * Dry-run (print what would be patched, skip Sanity writes):
 *   DRY_RUN=true DOTENV_CONFIG_PATH=.env.local npx tsx scripts/seed-section-backgrounds/index.ts
 */

import { config } from 'dotenv'
import path from 'path'
import { createClient } from '@sanity/client'

config({ path: path.resolve(process.cwd(), process.env.DOTENV_CONFIG_PATH ?? '.env.local') })

const DRY_RUN = process.env.DRY_RUN === 'true'

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'a6wgzngo',
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET    ?? 'production',
  apiVersion: '2026-05-15',
  token:      process.env.SANITY_API_WRITE_TOKEN,
  useCdn:     false,
})

// ── Helpers ───────────────────────────────────────────────────────

type SanityDoc = {
  _id: string
  coverImage?: {
    _type: string
    asset?: { _type: string; _ref: string }
    hotspot?: unknown
    crop?: unknown
    alt?: string
  }
}

function buildImageRef(
  sourceImage: SanityDoc['coverImage'],
  alt: string,
): Record<string, unknown> | null {
  if (!sourceImage?.asset?._ref) return null
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: sourceImage.asset._ref },
    ...(sourceImage.hotspot ? { hotspot: sourceImage.hotspot } : {}),
    ...(sourceImage.crop    ? { crop:    sourceImage.crop    } : {}),
    alt,
  }
}

async function fetchTrip(slug: string): Promise<SanityDoc | null> {
  return sanity.fetch<SanityDoc | null>(
    `*[_type == "trip" && slug.current == $slug][0]{ _id, coverImage }`,
    { slug },
  )
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log('→ Fetching trip documents…\n')

  const [barcelona, ibiza] = await Promise.all([
    fetchTrip('barcelona'),
    fetchTrip('ibiza'),
  ])

  if (!barcelona) {
    console.error('✗ Barcelona trip not found — is the slug "barcelona"?')
    process.exit(1)
  }
  if (!ibiza) {
    console.warn('⚠  Ibiza trip not found — will reuse Barcelona cover for both sections')
  }

  const inclusionsBg         = buildImageRef(barcelona.coverImage, 'Barcelona city atmosphere')
  const signatureExperienceBg = buildImageRef(
    ibiza?.coverImage ?? barcelona.coverImage,
    ibiza ? 'Ibiza nightlife atmosphere' : 'Barcelona atmosphere',
  )

  if (!inclusionsBg || !signatureExperienceBg) {
    console.error('✗ Cover image asset reference missing — upload a cover image to the trip first')
    process.exit(1)
  }

  console.log('Sections to seed:')
  console.log(`  1. Barcelona → inclusionsBgImage            (asset: ${(inclusionsBg.asset as {_ref: string})._ref.slice(0, 32)}…)`)
  console.log(`  2. Barcelona → signatureExperienceBgImage   (asset: ${(signatureExperienceBg.asset as {_ref: string})._ref.slice(0, 32)}…)`)
  console.log(`\nSections between them: itinerary, clubs, hotelOptions (3 separators — non-adjacent ✓)\n`)

  if (DRY_RUN) {
    console.log('DRY_RUN=true — skipping Sanity writes.')
    return
  }

  await sanity.patch(barcelona._id).set({
    inclusionsBgImage:          inclusionsBg,
    signatureExperienceBgImage: signatureExperienceBg,
  }).commit()

  console.log(`✔ Barcelona (${barcelona._id}) patched with 2 section background images.`)
  console.log('\n✅ Done.')
}

main().catch((err) => {
  console.error('\n✗ Script failed:', err)
  process.exit(1)
})
