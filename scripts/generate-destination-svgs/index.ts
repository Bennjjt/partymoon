/**
 * Generate destination SVG silhouettes and upload to Sanity.
 *
 * What it does:
 *   1. Downloads Natural Earth 110m country TopoJSON from world-atlas CDN
 *   2. Extracts the relevant country feature for each trip destination
 *   3. Projects it to a normalised SVG path using d3-geo (Mercator, auto-fit)
 *   4. Writes .svg preview files to scripts/generate-destination-svgs/output/
 *   5. Patches each Sanity trip document with regionSvgPath + regionSvgViewBox
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx scripts/generate-destination-svgs/index.ts
 *
 * Dry-run (generate SVG files only, skip Sanity upload):
 *   DRY_RUN=true DOTENV_CONFIG_PATH=.env.local npx tsx scripts/generate-destination-svgs/index.ts
 */

import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'
import * as d3geo from 'd3-geo'
import * as topojson from 'topojson-client'
import { createClient } from '@sanity/client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { Feature, Geometry } from 'geojson'

config({ path: path.resolve(process.cwd(), process.env.DOTENV_CONFIG_PATH ?? '.env.local') })

// ── Config ────────────────────────────────────────────────────────

const DRY_RUN = process.env.DRY_RUN === 'true'

const SVG_WIDTH  = 320
const SVG_HEIGHT = 320

// world-atlas v2 — free, no attribution required in production
const TOPOJSON_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ISO 3166-1 numeric codes used in world-atlas
// Ibiza shares Spain's country feature (correct at country level; suitable for decorative use)
const DESTINATIONS: Array<{
  slug: string          // Sanity document slug
  destination: string  // Display name
  countryNumeric: string // ISO numeric code in world-atlas
  label: string        // Human-readable for logs
}> = [
  { slug: 'amsterdam',  destination: 'Amsterdam',  countryNumeric: '528', label: 'Netherlands' },
  { slug: 'copenhagen', destination: 'Copenhagen', countryNumeric: '208', label: 'Denmark'     },
  { slug: 'berlin',     destination: 'Berlin',     countryNumeric: '276', label: 'Germany'     },
  { slug: 'barcelona',  destination: 'Barcelona',  countryNumeric: '724', label: 'Spain'       },
  { slug: 'ibiza',      destination: 'Ibiza',      countryNumeric: '724', label: 'Spain (Ibiza)' },
  { slug: 'mykonos',    destination: 'Mykonos',    countryNumeric: '300', label: 'Greece'      },
]

// ── Sanity client ─────────────────────────────────────────────────

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'a6wgzngo',
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET    ?? 'production',
  apiVersion: '2026-05-15',
  token:      process.env.SANITY_API_WRITE_TOKEN,
  useCdn:     false,
})

// ── Helpers ───────────────────────────────────────────────────────

function featureToSvg(feature: Feature<Geometry>): { path: string; viewBox: string } {
  const projection = d3geo.geoMercator().fitSize([SVG_WIDTH, SVG_HEIGHT], feature)
  const pathGen    = d3geo.geoPath(projection)
  const d          = pathGen(feature)
  if (!d) throw new Error('d3-geo produced an empty path — check the feature geometry')

  // Add 8px padding so stroke isn't clipped at the edge
  const pad     = 8
  const viewBox = `${-pad} ${-pad} ${SVG_WIDTH + pad * 2} ${SVG_HEIGHT + pad * 2}`
  return { path: d, viewBox }
}

function buildPreviewSvg(path: string, viewBox: string, label: string): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">`,
    `  <!-- ${label} silhouette — PartyMoon brand colours -->`,
    `  <path`,
    `    d="${path}"`,
    `    fill="rgba(201,168,76,0.12)"`,
    `    stroke="#c9a84c"`,
    `    stroke-width="1.5"`,
    `    stroke-linejoin="round"`,
    `  />`,
    `</svg>`,
  ].join('\n')
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log('→ Downloading Natural Earth TopoJSON from world-atlas CDN…')
  const res = await fetch(TOPOJSON_URL)
  if (!res.ok) throw new Error(`Failed to download TopoJSON: ${res.status} ${res.statusText}`)

  const topology = await res.json() as Topology

  // world-atlas stores countries as a GeometryCollection on topology.objects.countries
  const collection = topojson.feature(
    topology,
    topology.objects.countries as GeometryCollection,
  )

  const outputDir = path.resolve(process.cwd(), 'scripts/generate-destination-svgs/output')
  fs.mkdirSync(outputDir, { recursive: true })

  for (const dest of DESTINATIONS) {
    console.log(`\n[${dest.slug}] Processing ${dest.label}…`)

    // world-atlas feature IDs are ISO numeric strings
    const feature = collection.features.find(
      (f) => String(f.id) === dest.countryNumeric,
    )

    if (!feature) {
      console.warn(`  ✗ Country not found for ISO numeric ${dest.countryNumeric} — skipping`)
      continue
    }

    const { path: svgPath, viewBox } = featureToSvg(feature as Feature<Geometry>)
    const svgMarkup = buildPreviewSvg(svgPath, viewBox, dest.label)

    // Write preview file
    const outFile = path.join(outputDir, `${dest.slug}.svg`)
    fs.writeFileSync(outFile, svgMarkup, 'utf-8')
    console.log(`  ✔ SVG written → ${path.relative(process.cwd(), outFile)}`)

    if (DRY_RUN) {
      console.log('  ↷ DRY_RUN — skipping Sanity upload')
      continue
    }

    // Find the Sanity document by slug
    const doc = await sanity.fetch<{ _id: string } | null>(
      `*[_type == "trip" && slug.current == $slug][0]{ _id }`,
      { slug: dest.slug },
    )

    if (!doc) {
      console.warn(`  ✗ No Sanity trip found with slug "${dest.slug}" — skipping patch`)
      continue
    }

    await sanity.patch(doc._id).set({
      regionSvgPath:    svgPath,
      regionSvgViewBox: viewBox,
    }).commit()

    console.log(`  ✔ Sanity trip "${dest.slug}" patched with SVG data`)
  }

  console.log(`\n✅ Done. Preview SVGs saved to scripts/generate-destination-svgs/output/`)
  if (DRY_RUN) {
    console.log('   (Dry run — no Sanity documents were modified)')
  }
}

main().catch((err) => {
  console.error('\n✗ Script failed:', err)
  process.exit(1)
})
