/**
 * Seed script: populate Sanity with 6 PartyMoon trip destinations.
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx scripts/seed-trips/index.ts
 *
 * What it does:
 *   1. Deletes all existing trip documents in Sanity
 *   2. Fetches cover + gallery images from Unsplash CDN
 *   3. Uploads each image to Sanity Assets
 *   4. Creates 6 fully-populated trip documents (Amsterdam, Copenhagen, Berlin, Barcelona, Ibiza, Mykonos)
 *
 * Safe to re-run: deterministic _id values (trip-{slug}) mean re-running patches rather than duplicates.
 */

import { config } from 'dotenv'
import path from 'path'

// Load from .env.local (Next.js convention) — fall back to .env
config({ path: path.resolve(process.cwd(), '.env.local') })
config({ path: path.resolve(process.cwd(), '.env') })

import { createClient } from '@sanity/client'
import type { PortableTextBlock } from 'next-sanity'

// ── Sanity client ─────────────────────────────────────────────────────────────
const sanity = createClient({
  projectId: 'a6wgzngo',
  dataset: 'production',
  apiVersion: '2026-05-15',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function randomKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

function sanityId(slug: string): string {
  return `trip-${slug}`
}

function pt(paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: randomKey(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: randomKey(), text, marks: [] }],
  } as unknown as PortableTextBlock))
}

// ── Image upload ──────────────────────────────────────────────────────────────
// Cache of Unsplash photo ID → Sanity asset _id to avoid duplicate uploads
const uploadCache = new Map<string, string>()

async function uploadUnsplashPhoto(
  photoId: string,
  altText: string,
): Promise<string | null> {
  if (uploadCache.has(photoId)) return uploadCache.get(photoId)!

  const url = `https://images.unsplash.com/photo-${photoId}?w=1920&q=80&auto=format&fit=crop`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  [img] HTTP ${res.status} for photo-${photoId} — skipping`)
      return null
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    const asset = await sanity.assets.upload('image', buffer, {
      filename: `${photoId}.jpg`,
      contentType: 'image/jpeg',
    })
    uploadCache.set(photoId, asset._id)
    console.log(`  [img] Uploaded photo-${photoId} → ${asset._id}`)
    return asset._id
  } catch (err) {
    console.warn(`  [img] Failed to upload photo-${photoId}:`, (err as Error).message)
    return null
  }
}

function imageRef(assetId: string, alt: string) {
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: assetId },
    alt,
  }
}

// ── Trip data ─────────────────────────────────────────────────────────────────

interface TripSeed {
  slug: string
  destination: string
  title: string
  status: 'published' | 'draft'
  startDate: string
  endDate: string
  hotel: string
  clubNights: string
  includes: string
  spotsTotal: number
  spotsTaken: number
  priceFrom: number
  deposit: number
  showMap: boolean
  latitude: number
  longitude: number
  heroTagline: string
  introText: string[]
  summary: string[]
  inclusions: Array<{ icon: string; title: string; sub: string; detail: string }>
  itinerary: Array<{ tag: string; day: number; title: string; description: string }>
  clubs: Array<{ badge: string; name: string; vibe: string; description: string }>
  hotelOptions: Array<{ tier: string; name: string; location: string; features: string[] }>
  signatureExperience: {
    eyebrow: string
    heading: string
    description: string[]
    stats: Array<{ label: string; value: string; tag: string }>
  }
  spa: {
    eyebrow: string
    heading: string
    subheading: string
    description: string
    features: string[]
  }
  diningExperiences: Array<{ nightLabel: string; title: string; description: string }>
  hosts: Array<{ icon: string; role: string; name: string; bio: string }>
  // Unsplash photo IDs — cover first, then gallery
  photos: { cover: string; gallery: Array<{ id: string; caption: string }> }
}

const TRIPS: TripSeed[] = [
  // ── AMSTERDAM ────────────────────────────────────────────────────────────────
  {
    slug: 'amsterdam',
    destination: 'Amsterdam',
    title: 'Amsterdam VIP Weekend — September 2026',
    status: 'published',
    startDate: '2026-09-11',
    endDate: '2026-09-13',
    hotel: 'Waldorf Astoria Amsterdam',
    clubNights: 'Shelter · Paradiso · Club NYX',
    includes: 'Flights, transfers, hotel, club entry',
    spotsTotal: 25,
    spotsTaken: 8,
    priceFrom: 2200,
    deposit: 350,
    showMap: true,
    latitude: 52.3676,
    longitude: 4.9041,
    heroTagline: 'Canals at midnight, dancing until the light comes back.',
    introText: [
      'Amsterdam is a city that never quite sleeps. Its canal-laced streets transform after dark into something altogether different — intimate, electric, impossible to replicate anywhere else in Europe.',
      'We\'ve curated the finest hotels along the Herengracht, secured VIP tables at the venues that define the city\'s world-class underground scene, and planned every moment so you never have to think about logistics.',
      'This is Amsterdam done properly. Dutch precision meets pure hedonism.',
    ],
    summary: [
      'A three-day assault on one of Europe\'s greatest cities. Canal cruises by day, underground clubs by night. Twenty-five guests, one impeccable weekend.',
    ],
    inclusions: [
      { icon: 'Plane', title: 'Return Flights from the UK', sub: 'From major UK airports', detail: 'Direct return flights from London Gatwick or Manchester to Amsterdam Schiphol, including all taxes and baggage allowance.' },
      { icon: 'Hotel', title: 'Five-Star Hotel Accommodation', sub: 'Two nights, breakfast included', detail: 'Two nights at the Waldorf Astoria Amsterdam or equivalent, occupying renovated 17th-century canal mansions on the Herengracht.' },
      { icon: 'Bus', title: 'Private Airport Transfers', sub: 'Schiphol to hotel and return', detail: 'Luxury minibus transfers between Schiphol Airport and your hotel, timed to your flight.' },
      { icon: 'Music', title: 'VIP Club Entry — All Nights', sub: 'Three venues, zero queues', detail: 'Guaranteed entry with VIP table or floor reservation at Shelter, Paradiso, and Club NYX. No queues, no dress code stress.' },
      { icon: 'Ship', title: 'Private Canal Cruise', sub: 'Saturday afternoon', detail: 'Two-hour private boat on Amsterdam\'s UNESCO-listed canals — drinks included, hosted by your Partymoon guide.' },
      { icon: 'Utensils', title: 'Welcome Dinner', sub: 'Friday night', detail: 'Seated dinner at a curated Amsterdam restaurant — traditional Dutch with a modern edge.' },
      { icon: 'Users', title: 'Dedicated Partymoon Hosts', sub: 'With you the whole weekend', detail: 'Two experienced hosts manage your full itinerary, venue entry, and any requests from the moment you land.' },
      { icon: 'ShieldCheck', title: 'Travel Insurance', sub: 'Full weekend coverage', detail: 'Comprehensive travel and cancellation insurance for the duration of the trip.' },
    ],
    itinerary: [
      { tag: 'Day 1 · Arrival', day: 1, title: 'TOUCH DOWN. CHAMPAGNE UP.', description: 'Transfer from Schiphol to the Waldorf. Check in, freshen up, then meet the group for a welcome cocktail reception in the hotel\'s private bar. Dinner follows at a neighbourhood bistro on the Jordaan before your first taste of Amsterdam after dark at Club NYX.' },
      { tag: 'Day 2 · The Full Day', day: 2, title: 'CANALS BY DAY. UNDERGROUND BY NIGHT.', description: 'Late breakfast at the hotel. Early afternoon: a private two-hour canal cruise through the historic city centre — drinks on board, commentary optional. Back to the hotel to rest, then into Paradiso for the evening. One of the world\'s most iconic music venues, inside a converted church.' },
      { tag: 'Day 3 · Finale', day: 3, title: 'ONE LAST MORNING. ONE LAST DANCE.', description: 'Leisurely brunch. A final wander through the Jordaan or the Rijksmuseum area. Transfer to Schiphol with a send-off from your hosts.' },
    ],
    clubs: [
      { badge: 'VIP · Underground', name: 'Shelter', vibe: 'Techno · Industrial · Extended sets', description: 'Beneath the A\'DAM Tower in Amsterdam-Noord, Shelter is the city\'s premier underground venue. Raw concrete, world-class soundsystem, residents who play until 8am. This is what Amsterdam techno actually sounds like.' },
      { badge: 'VIP · Iconic', name: 'Paradiso', vibe: 'House · Electronic · International acts', description: 'A converted 19th-century church that hosts international DJs and live acts alike. Paradiso has been the centre of Amsterdam\'s music culture since the 1970s. On a Saturday night, there\'s nowhere better.' },
      { badge: 'VIP · Boutique', name: 'Club NYX', vibe: 'Queer-friendly · Dance · House · RnB', description: 'A smaller, more intimate club in the heart of the Rembrandtplein. NYX is celebrated for its inclusive atmosphere, diverse programming, and the quality of its resident DJs.' },
    ],
    hotelOptions: [
      { tier: 'Signature Pick', name: 'Waldorf Astoria Amsterdam', location: 'Herengracht · Canal Belt', features: ['Six restored 17th-century canal mansions', 'Michelin-starred restaurant Spectrum', 'Guerlain Spa', 'Private canal-side garden', 'Butlers on every floor'] },
      { tier: 'Design Favourite', name: 'Hotel Pulitzer Amsterdam', location: 'Prinsengracht · Jordaan', features: ['25 interconnected canal houses', 'Award-winning cocktail bar', 'Private garden terrace', 'Curated art collection', 'Steps from the Jordaan markets'] },
      { tier: 'Boutique Gem', name: 'The Dylan Amsterdam', location: 'Keizersgracht · Canal Belt', features: ['17th-century coaching inn heritage', 'Michelin-starred Vinkeles restaurant', 'Intimate 40-room property', 'Private dining rooms', 'Concierge with city-wide access'] },
    ],
    signatureExperience: {
      eyebrow: 'Day 2 · Saturday Afternoon',
      heading: 'THE CANAL CRUISE.',
      description: [
        'Two hours on a private boat, drifting through the UNESCO-listed canal ring that has defined Amsterdam since the Golden Age. Drinks in hand, the city\'s 1,500 bridges sliding past, your hosts on board to point out the hidden courtyards and merchant houses.',
        'This is the version of Amsterdam most visitors never see — quiet, intimate, unhurried.',
      ],
      stats: [
        { label: 'Duration', value: 'Two full hours', tag: 'Private' },
        { label: 'Capacity', value: 'Your group only', tag: 'Exclusive' },
        { label: 'Includes', value: 'Drinks & canapés', tag: 'Hosted' },
        { label: 'Route', value: 'Historic canal ring', tag: 'UNESCO' },
      ],
    },
    spa: {
      eyebrow: 'Day 2 · Late Afternoon',
      heading: 'THE SPA.',
      subheading: 'because Saturday needs recovering from Friday.',
      description: 'The Guerlain Spa at the Waldorf Astoria occupies the vaulted cellars of the original canal mansion. Heated pool, steam rooms, and a menu of treatments designed around rest and preparation for the night ahead.',
      features: ['Guerlain treatments & facials', 'Heated indoor pool', 'Steam room & sauna', 'Relaxation lounge with canal views', 'Pre-booking for group slots'],
    },
    diningExperiences: [
      { nightLabel: 'Night One', title: 'Dutch Brasserie — The Real Amsterdam', description: 'Friday dinner at a neighbourhood restaurant in the Jordaan. Traditional Dutch cooking — bitterballen, stamppot, local seafood — done with a modern lens. A chance to settle in before the weekend begins.' },
      { nightLabel: 'Night Two', title: 'Spectrum — Michelin-Starred Tasting Menu', description: 'Saturday dinner at Spectrum inside the Waldorf. Chef Sidney Schutte\'s tasting menu draws from over 40 countries, guided by the hotel\'s extraordinary wine cellar. Two Michelin stars, one table for twenty-five.' },
    ],
    hosts: [
      { icon: 'Music', role: 'Nightlife Curator & VIP Lead', name: 'Your Club Host', bio: 'Amsterdam-born, decade of venue relationships across Shelter, Paradiso, and the broader Dutch club circuit. Handles every entry, every table, every moment the night goes sideways.' },
      { icon: 'MapPin', role: 'Travel & Logistics Lead', name: 'Your City Host', bio: 'Coordinates all ground logistics from the moment you land — transfers, restaurant bookings, hotel check-in, and everything in between so you never have to think about it.' },
    ],
    photos: {
      cover: '1512917774080-9991f1c4c750',
      gallery: [
        { id: '1534351590666-13e3e96b5017', caption: 'Herengracht canal at dusk' },
        { id: '1558618666-fcd25c85cd64', caption: 'Inside Shelter Amsterdam' },
        { id: '1570641963303-b5cb1e4afc26', caption: 'Paradiso main hall' },
        { id: '1490274004804-4c533bd31ca9', caption: 'Amsterdam Jordaan streets' },
        { id: '1555554575-6ddbe6d0f04c', caption: 'Canal cruise, golden hour' },
      ],
    },
  },

  // ── COPENHAGEN ───────────────────────────────────────────────────────────────
  {
    slug: 'copenhagen',
    destination: 'Copenhagen',
    title: 'Copenhagen VIP Weekend — October 2026',
    status: 'published',
    startDate: '2026-10-09',
    endDate: '2026-10-11',
    hotel: 'Hotel D\'Angleterre',
    clubNights: 'Culture Box · Jolene · RUST',
    includes: 'Flights, transfers, hotel, club entry',
    spotsTotal: 25,
    spotsTaken: 5,
    priceFrom: 2400,
    deposit: 380,
    showMap: true,
    latitude: 55.6761,
    longitude: 12.5683,
    heroTagline: 'Hygge in the streets. Hedonism in the basement.',
    introText: [
      'Copenhagen has built one of Europe\'s most respected electronic music scenes in near silence — no fanfare, no marketing. Just serious venues, serious sound systems, and a crowd that comes to dance.',
      'Above ground it\'s all candlelit restaurants and harbour-side architecture. Below it, the city pulses to a different frequency entirely. Both versions are extraordinary.',
      'We\'ve assembled the weekend that holds both. Stay in the grandest hotel on Kongens Nytorv, eat at restaurants that have redefined Nordic cuisine, and dance in rooms that have shaped modern club culture.',
    ],
    summary: [
      'Three days in the Danish capital — a city that rewards the curious and the committed. Noma alumni in the kitchen, techno purists on the decks.',
    ],
    inclusions: [
      { icon: 'Plane', title: 'Return Flights from the UK', sub: 'From major UK airports', detail: 'Direct return flights from London Heathrow or Gatwick to Copenhagen Airport, including taxes and cabin baggage.' },
      { icon: 'Hotel', title: 'Five-Star Hotel Accommodation', sub: 'Two nights, breakfast included', detail: 'Two nights at Hotel D\'Angleterre, Copenhagen\'s historic grand hotel on Kongens Nytorv, in operation since 1755.' },
      { icon: 'Bus', title: 'Private Airport Transfers', sub: 'CPH to hotel and return', detail: 'Luxury transfer from Copenhagen Airport to your hotel and back.' },
      { icon: 'Music', title: 'VIP Club Entry — All Nights', sub: 'Three venues, zero queues', detail: 'Priority access to Culture Box, Jolene, and RUST — Copenhagen\'s three essential electronic venues.' },
      { icon: 'Utensils', title: 'Noma-Alumni Dining Experience', sub: 'Saturday evening', detail: 'Reservation at a restaurant helmed by former Noma chefs — Nordic ingredients, revolutionary technique.' },
      { icon: 'Bike', title: 'Private City Cycle Tour', sub: 'Saturday morning', detail: 'Guided cycle through Nørrebro, the Meatpacking District, and the harbour front — the Copenhagen locals actually use.' },
      { icon: 'Users', title: 'Dedicated Partymoon Hosts', sub: 'With you the whole weekend', detail: 'Two experienced hosts managing your full itinerary end to end.' },
      { icon: 'ShieldCheck', title: 'Travel Insurance', sub: 'Full weekend coverage', detail: 'Comprehensive travel and cancellation insurance for the duration of the trip.' },
    ],
    itinerary: [
      { tag: 'Day 1 · Arrival', day: 1, title: 'LAND. CHECK IN. NEGRONI SBAGLIATO.', description: 'Transfer from Copenhagen Airport to Hotel D\'Angleterre. Evening drinks in the hotel bar overlooking Kongens Nytorv, then dinner in Nørrebro — a neighbourhood that has quietly become one of the most interesting in northern Europe. First night at RUST on Guldbergsgade.' },
      { tag: 'Day 2 · The Main Event', day: 2, title: 'NORDIC MORNING. UNDERGROUND NIGHT.', description: 'Morning cycle tour through the Meatpacking District and along the harbour. Brunch. Afternoon free for the city. Early dinner at a Noma-alumni restaurant — six courses of Nordic ingenuity. Then Culture Box: Copenhagen\'s definitive techno institution, in a converted industrial space in the Latin Quarter.' },
      { tag: 'Day 3 · Departure', day: 3, title: 'ONE LAST SMØRREBRØD.', description: 'Late checkout, long brunch. A walk through Nyhavn or a visit to the Louisiana Museum of Modern Art if time allows. Transfer to the airport.' },
    ],
    clubs: [
      { badge: 'VIP · Institution', name: 'Culture Box', vibe: 'Techno · Minimal · International DJs', description: 'The venue that put Copenhagen on the global club map. Three rooms, a world-class Funktion-One soundsystem, and a booking policy that has kept pace with Berlin for over two decades. Residents here are among the finest in northern Europe.' },
      { badge: 'VIP · Neighbourhood', name: 'Jolene', vibe: 'House · Disco · Eclectic', description: 'A basement bar in the Meatpacking District that has become the city\'s most loved weekly ritual. Small, warm, and intensely musical. Jolene represents what Copenhagen does better than most cities — effortless cool without attitude.' },
      { badge: 'VIP · Multivenue', name: 'RUST', vibe: 'Electronic · Live · Indie', description: 'Five stages across two floors in Nørrebro, RUST presents a mix of electronic and live music that draws Copenhagen\'s most musically diverse crowd. A great starting point and a great end point.' },
    ],
    hotelOptions: [
      { tier: 'Signature Pick', name: 'Hotel D\'Angleterre', location: 'Kongens Nytorv · City Centre', features: ['Historic grand hotel since 1755', 'Michelin-recommended restaurant Marchal', 'Nimb Brasserie access', 'Hammam spa', 'Steps from Nyhavn and the Royal Theatre'] },
      { tier: 'Design Favourite', name: 'Hotel SP34', location: 'Latin Quarter · City Centre', features: ['Award-winning Scandinavian design', 'Rooftop bar with city views', 'BROR restaurant (Noma alumni)', 'Curated art throughout', 'Ideal location for Culture Box'] },
      { tier: 'Boutique Gem', name: 'Brøchner Hotels — Villa Copenhagen', location: 'Central Station · Tivoli', features: ['Converted 1930s post office', 'Rooftop pool', 'Mille restaurant', 'Terrace overlooking Tivoli Gardens', 'Spa & wellness centre'] },
    ],
    signatureExperience: {
      eyebrow: 'Day 2 · Saturday Morning',
      heading: 'THE CYCLE TOUR.',
      description: [
        'Copenhagen is a city built for bikes. On Saturday morning your guide takes you through the parts most visitors never see — the regenerated Meatpacking District, the harbour baths, Nørrebro\'s street murals, and the canal-side architecture that defines the new Copenhagen.',
        'Two hours, twenty-five people, and a city that reveals itself differently on two wheels.',
      ],
      stats: [
        { label: 'Duration', value: 'Two hours', tag: 'Guided' },
        { label: 'Route', value: 'Nørrebro to Harbour', tag: 'Local' },
        { label: 'Style', value: 'Relaxed pace', tag: 'All levels' },
        { label: 'Bikes', value: 'Included', tag: 'Provided' },
      ],
    },
    spa: {
      eyebrow: 'Day 2 · Late Afternoon',
      heading: 'THE HAMMAM.',
      subheading: 'steam before Saturday night.',
      description: 'Hotel D\'Angleterre\'s hammam and spa provides the perfect reset between day and night on Saturday. Traditional steam treatments, cold plunge, and a relaxation room with views over the city.',
      features: ['Traditional hammam steam experience', 'Cold plunge pool', 'Relaxation lounge', 'Treatment rooms (bookable)', 'In-house therapists'],
    },
    diningExperiences: [
      { nightLabel: 'Night One', title: 'Nørrebro Local — New Nordic Bistro', description: 'Friday dinner in Copenhagen\'s most interesting neighbourhood. A small, casual restaurant championing the hyper-local seasonal produce that made Nordic cuisine famous. No tablecloths, all flavour.' },
      { nightLabel: 'Night Two', title: 'Noma Alumni Fine Dining — Six Courses', description: 'Saturday\'s main event before the clubs. A six-course tasting menu at a restaurant opened by former Noma chefs, applying the same philosophy — foraged, fermented, precise — in a more accessible setting. One Michelin star.' },
    ],
    hosts: [
      { icon: 'Music', role: 'Nightlife Curator & VIP Lead', name: 'Your Club Host', bio: 'Based between Copenhagen and Berlin, with years of relationships across Culture Box, Jolene, and the broader Scandinavian scene. Handles all entry, all tables, all the moments where things could go wrong.' },
      { icon: 'MapPin', role: 'City & Logistics Lead', name: 'Your City Host', bio: 'Copenhagen native. Coordinates transfers, restaurants, the cycle tour, and hotel logistics from the moment you arrive to the moment you leave.' },
    ],
    photos: {
      cover: '1513622470522-26c3c8a854bc',
      gallery: [
        { id: '1530538987638-9d7e8dcf3a3a', caption: 'Nyhavn canal at golden hour' },
        { id: '1558618666-fcd25c85cd64', caption: 'Culture Box main room' },
        { id: '1578662996442-48f60103fc96', caption: 'Copenhagen skyline at dusk' },
        { id: '1503614472-8c093d56e4a7', caption: 'Nørrebro street life' },
        { id: '1480714378408-67cf0d13bc1b', caption: 'Nordic cuisine close-up' },
      ],
    },
  },

  // ── BERLIN ────────────────────────────────────────────────────────────────────
  {
    slug: 'berlin',
    destination: 'Berlin',
    title: 'Berlin VIP Weekend — November 2026',
    status: 'published',
    startDate: '2026-11-06',
    endDate: '2026-11-08',
    hotel: 'Soho House Berlin',
    clubNights: 'Berghain · Watergate · Tresor',
    includes: 'Flights, transfers, hotel, club entry',
    spotsTotal: 25,
    spotsTaken: 12,
    priceFrom: 1950,
    deposit: 300,
    showMap: true,
    latitude: 52.5200,
    longitude: 13.4050,
    heroTagline: 'The capital of the night. The city that invented the weekend.',
    introText: [
      'Berlin does not have a nightlife. Berlin is a nightlife. The city rebuilt itself around the freedom to dance, and forty years later the rooms that emerged from the rubble of the Wall are still the most important clubs in the world.',
      'Berghain. Watergate. Tresor. These are not tourist destinations — they are the reasons the entire global electronic music industry makes the pilgrimage. And we go in without the queue.',
      'Three days. The most significant city in club music history. Done the only way it deserves to be done.',
    ],
    summary: [
      'Berlin is the benchmark every other city measures itself against. This weekend you\'ll experience it properly — Michelin restaurants, gallery-grade hotel design, and the clubs that changed music forever.',
    ],
    inclusions: [
      { icon: 'Plane', title: 'Return Flights from the UK', sub: 'From major UK airports', detail: 'Direct return flights from London to Berlin Brandenburg Airport, including all taxes and cabin luggage.' },
      { icon: 'Hotel', title: 'Boutique Hotel Accommodation', sub: 'Two nights, breakfast included', detail: 'Two nights at Soho House Berlin in the Mitte neighbourhood — rooftop pool, members-only club, and some of the city\'s best rooms.' },
      { icon: 'Bus', title: 'Private Airport Transfers', sub: 'BER to hotel and return', detail: 'Luxury minibus from Berlin Brandenburg Airport to Soho House and return.' },
      { icon: 'Music', title: 'VIP Club Entry — All Nights', sub: 'Three iconic venues, no queue', detail: 'Guaranteed entry to Berghain (Saturday), Watergate (Friday), and Tresor (Saturday late). Our relationships mean you go in.' },
      { icon: 'Utensils', title: 'Welcome Dinner', sub: 'Friday evening', detail: 'Dinner at a curated Berlin restaurant — modern German cuisine, natural wines, Kreuzberg neighbourhood.' },
      { icon: 'Frame', title: 'Gallery District Tour', sub: 'Saturday afternoon', detail: 'Private walk through Berlin\'s gallery district in Mitte — the concentration of contemporary art here rivals any city in the world.' },
      { icon: 'Users', title: 'Dedicated Partymoon Hosts', sub: 'With you the whole weekend', detail: 'Two experienced hosts, Berlin-based, managing the full itinerary from landing to departure.' },
      { icon: 'ShieldCheck', title: 'Travel Insurance', sub: 'Full weekend coverage', detail: 'Comprehensive travel and cancellation insurance.' },
    ],
    itinerary: [
      { tag: 'Day 1 · Friday', day: 1, title: 'ARRIVE. EAT. WATERGATE.', description: 'Transfer from BER to Soho House. Check in, rooftop drinks, then dinner in Kreuzberg. Late evening: Watergate on the Spree — a two-floor glass-fronted club with waterside views and a booking policy built around serious electronic music.' },
      { tag: 'Day 2 · Saturday', day: 2, title: 'GALLERY. GALLERY. BERGHAIN.', description: 'Late breakfast. Afternoon walking tour through the gallery district — Galerie Eigen+Art, Sprüth Magers, König Galerie. Back to the hotel to rest. Dinner in Prenzlauer Berg. Then: Berghain. The main room, the Panorama Bar, and the understanding that this is the most important club in the world.' },
      { tag: 'Day 3 · Sunday', day: 3, title: 'COFFEE. CURRYWURST. HOME.', description: 'Berlin Sundays are legendary. Brunch at a café in Mitte. A walk along the East Side Gallery. Tresor Sunday session for those who still have it in them. Transfers to BER.' },
    ],
    clubs: [
      { badge: 'VIP · Legendary', name: 'Berghain', vibe: 'Techno · Industrial · 72-hour sets', description: 'There is nothing to add about Berghain that hasn\'t been written. The former power station in Friedrichshain is the most celebrated nightclub in the world. The main floor is a cathedral of sound. The Panorama Bar above it is where house music lives. We go in.' },
      { badge: 'VIP · Waterside', name: 'Watergate', vibe: 'House · Techno · Panoramic Spree views', description: 'Two floors built into the bank of the Spree, with floor-to-ceiling windows that frame the water. Watergate was responsible for establishing Berlin\'s current sound — deeper, more melodic, less brutal than Berghain. A perfect Friday night.' },
      { badge: 'VIP · Historic', name: 'Tresor', vibe: 'Hardcore Techno · Industrial · Detroit', description: 'In the vaults beneath a former power plant in Mitte, Tresor opened in 1991 in the remains of a department store safe room. It established the Detroit-Berlin axis that defined electronic music. The main vault is still active, still raw, still essential.' },
    ],
    hotelOptions: [
      { tier: 'Signature Pick', name: 'Soho House Berlin', location: 'Mitte · Torstraße', features: ['Rooftop pool with city views', 'Members\' club access', 'Cowshed Spa', 'Lively restaurant & bar scene', 'Walking distance to Mitte galleries'] },
      { tier: 'Design Favourite', name: 'Bikini Berlin — 25hours Hotel', location: 'Charlottenburg · Zoo Quarter', features: ['Jungle Bar overlooking the zoo', 'Designed by Ursula Müller', 'Monkey Bar rooftop', 'Proximity to KaDeWe', 'Loft rooms with jungle terrace views'] },
      { tier: 'Boutique Gem', name: 'Hotel de Rome', location: 'Bebelplatz · Mitte', features: ['Former Dresdner Bank headquarters (1889)', 'Rooftop pool terrace', 'La Banca restaurant', 'Spa in the original vaulted bank vault', 'Opposite the Berlin State Opera'] },
    ],
    signatureExperience: {
      eyebrow: 'Day 2 · Saturday Afternoon',
      heading: 'THE GALLERY TOUR.',
      description: [
        'Berlin has the highest density of contemporary art galleries in the world. On Saturday afternoon, a private guided walk through the Mitte gallery district introduces you to the spaces that have shaped what the art world looks at for the past thirty years.',
        'König Galerie in a brutalist church. Galerie Eigen+Art on Auguststraße. Sprüth Magers on Oranienburger Straße. Two hours, no crowds, all context.',
      ],
      stats: [
        { label: 'Duration', value: 'Two hours', tag: 'Private' },
        { label: 'Galleries', value: 'Six curated spaces', tag: 'Guided' },
        { label: 'Area', value: 'Mitte to Prenzlauer Berg', tag: 'On foot' },
        { label: 'Guide', value: 'Art historian', tag: 'Expert' },
      ],
    },
    spa: {
      eyebrow: 'Day 2 · Late Afternoon',
      heading: 'THE COWSHED.',
      subheading: 'before the longest night.',
      description: 'Soho House\'s Cowshed Spa on the roof offers treatments, steam, and the hotel\'s heated rooftop pool — a rare luxury in Berlin, with a view of the city that makes the Saturday night ahead look very small indeed.',
      features: ['Cowshed treatments & facials', 'Heated rooftop pool', 'Steam room', 'Relaxation room', 'In-house Cowshed products'],
    },
    diningExperiences: [
      { nightLabel: 'Night One', title: 'Kreuzberg Local — Modern German Kitchen', description: 'Friday dinner in Kreuzberg at a neighbourhood restaurant doing what Berlin does best — seasonal German produce, natural wine list, no ceremony. A working dinner before Watergate.' },
      { nightLabel: 'Night Two', title: 'Prenzlauer Berg — Pre-Berghain Dinner', description: 'Saturday dinner in Prenzlauer Berg. A quieter, more residential neighbourhood close to the club. Carb-loading and red wine before the main event.' },
    ],
    hosts: [
      { icon: 'Music', role: 'Nightlife Curator & VIP Lead', name: 'Your Club Host', bio: 'Berlin-based with over a decade in the club circuit. Has relationships with door staff and promoters at Berghain, Watergate, and Tresor. When the door policy changes at midnight, your host already knows.' },
      { icon: 'MapPin', role: 'City & Art Lead', name: 'Your City Host', bio: 'Art history background, Berlin native. Guides the gallery tour and handles all logistics — transfers, restaurant bookings, hotel coordination from BER to departure.' },
    ],
    photos: {
      cover: '1560969184-10fe8719e047',
      gallery: [
        { id: '1467269204885-e5de37a6d4c8', caption: 'East Side Gallery at dusk' },
        { id: '1558618666-fcd25c85cd64', caption: 'Club dancefloor, Berlin' },
        { id: '1572036834978-0e31890de5e3', caption: 'Mitte streets, autumn' },
        { id: '1504889467-c7e5fb6b18c2', caption: 'Berghain exterior, evening' },
        { id: '1551721702-7c6be0dbb86d', caption: 'Berlin street art' },
      ],
    },
  },

  // ── BARCELONA ────────────────────────────────────────────────────────────────
  {
    slug: 'barcelona',
    destination: 'Barcelona',
    title: 'Barcelona VIP Weekend — July 2026',
    status: 'published',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    hotel: 'Hotel Arts Barcelona',
    clubNights: 'Pacha · Opium · Razzmatazz',
    includes: 'Flights, transfers, hotel, club entry',
    spotsTotal: 25,
    spotsTaken: 18,
    priceFrom: 2100,
    deposit: 325,
    showMap: true,
    latitude: 41.3851,
    longitude: 2.1734,
    heroTagline: 'The sea behind you. The beat ahead. Barcelona never asks permission.',
    introText: [
      'Barcelona operates on a different schedule to the rest of Europe. The city doesn\'t start until midnight, and the clubs — the real ones, not the tourist traps — don\'t peak until 4am. If you know where to be, this is the most exciting city on the Mediterranean.',
      'The venues here are not subtle. Pacha\'s main room holds over three thousand people and sounds like the future. Razzmatazz has five separate clubs under one roof. Opium puts you on the beach with international DJs until sunrise.',
      'We\'ve added a Gaudí architecture tour, a Barceloneta beach afternoon, and a Catalan tasting menu to make sure the days earn the nights.',
    ],
    summary: [
      'Sun, architecture, and the most unapologetic club culture in southern Europe. Barcelona in July is relentless in the best possible way.',
    ],
    inclusions: [
      { icon: 'Plane', title: 'Return Flights from the UK', sub: 'From major UK airports', detail: 'Direct return flights from London to Barcelona El Prat Airport, including taxes and cabin luggage.' },
      { icon: 'Hotel', title: 'Five-Star Hotel Accommodation', sub: 'Two nights, breakfast included', detail: 'Two nights at Hotel Arts — a 44-storey Frank Gehry-adjacent tower on Barceloneta beach, managed by Ritz-Carlton.' },
      { icon: 'Bus', title: 'Private Airport Transfers', sub: 'BCN to hotel and return', detail: 'Luxury transfer from El Prat to Hotel Arts and return.' },
      { icon: 'Music', title: 'VIP Club Entry — All Nights', sub: 'Three venues, no queues', detail: 'VIP entry to Pacha, Opium Beach, and Razzmatazz — Barcelona\'s three essential nightlife destinations.' },
      { icon: 'Waves', title: 'Barceloneta Beach Afternoon', sub: 'Saturday', detail: 'Private beach access at Hotel Arts with sunbeds, drinks service, and the Mediterranean.' },
      { icon: 'Landmark', title: 'Gaudí Architecture Tour', sub: 'Saturday morning', detail: 'Private two-hour tour of Gaudí\'s Barcelona — Sagrada Família exterior walk, Parc Güell, Casa Batlló facade. The city as designed.' },
      { icon: 'Users', title: 'Dedicated Partymoon Hosts', sub: 'With you the whole weekend', detail: 'Two experienced hosts managing the full itinerary from landing to departure.' },
      { icon: 'ShieldCheck', title: 'Travel Insurance', sub: 'Full weekend coverage', detail: 'Comprehensive travel and cancellation insurance.' },
    ],
    itinerary: [
      { tag: 'Day 1 · Friday', day: 1, title: 'LAND. SEA. OPIUM.', description: 'Transfer from El Prat to Hotel Arts. The hotel towers over Barceloneta beach — drop your bags and step straight onto the sand. Welcome drinks at sunset. Dinner in the Gothic Quarter. Late night: Opium Beach Club, where the Mediterranean is your backdrop and the DJ plays until sunrise.' },
      { tag: 'Day 2 · Saturday', day: 2, title: 'GAUDÍ BY DAY. PACHA BY NIGHT.', description: 'Morning Gaudí tour. Back for lunch and a long afternoon on the beach. Rest. Evening dinner at a Catalan tasting-menu restaurant. Then Pacha: the iconic Barcelona flagship of the global chain, still the best version of the brand anywhere in the world.' },
      { tag: 'Day 3 · Sunday', day: 3, title: 'SUNDAY MORNING. EL BORN. HOME.', description: 'Late breakfast. A walk through El Born and the Picasso Museum area. Optional trip to Razzmatazz for their legendary Sunday session. Transfers to El Prat.' },
    ],
    clubs: [
      { badge: 'VIP · Iconic', name: 'Pacha Barcelona', vibe: 'House · Commercial · International superstar DJs', description: 'The Barcelona iteration of the most recognisable nightclub brand in the world — and the best one. Three rooms, three thousand capacity, international headliners every weekend. On the Olympic Port, with views of the marina through the windows.' },
      { badge: 'VIP · Beach', name: 'Opium Barcelona', vibe: 'Beach Club · House · Mediterranean Sunrise', description: 'A beachfront club on Barceloneta where the floor is open-air and the sea is visible from the dancefloor. Opium operates best from midnight to 8am, when the sunrise over the Mediterranean becomes the best light show in the city.' },
      { badge: 'VIP · Five Rooms', name: 'Razzmatazz', vibe: 'Electronic · Rock · Five simultaneous rooms', description: 'Five clubs under one roof in the Poblenou industrial district. Each room has its own identity — from techno to indie to commercial house — making Razzmatazz the most diverse venue in Barcelona. The Sunday session has become a weekly institution.' },
    ],
    hotelOptions: [
      { tier: 'Signature Pick', name: 'Hotel Arts Barcelona', location: 'Barceloneta Beach · Olympic Port', features: ['Ritz-Carlton managed', '44-storey oceanfront tower', 'Enoteca Paco Pérez (two Michelin stars)', 'Outdoor infinity pool', 'Private beach access'] },
      { tier: 'Design Favourite', name: 'Hotel Mandarin Oriental Barcelona', location: 'Passeig de Gràcia · Eixample', features: ['Converted 1950s bank headquarters', 'Moments restaurant (two Michelin stars)', 'Rooftop terrace pool', 'Spa with hammam', 'Steps from Casa Batlló and Casa Milà'] },
      { tier: 'Boutique Gem', name: 'El Palace Barcelona', location: 'Gran Via · City Centre', features: ['Palace Hotel since 1919', 'Rooftop pool with panoramic views', 'Rooftop bar & terrace', 'Caelis restaurant', 'Original belle époque architecture'] },
    ],
    signatureExperience: {
      eyebrow: 'Day 2 · Saturday Morning',
      heading: 'THE GAUDÍ TOUR.',
      description: [
        'Antoni Gaudí spent his entire adult life designing a city-within-a-city in Barcelona, and most of it is still standing. On Saturday morning a private guide takes you through the most significant pieces — not the tourist queue, but the architecture conversation.',
        'Sagrada Família\'s exterior, Parc Güell before the crowds, the facade of Casa Batlló. Two hours of the most original architecture in Europe.',
      ],
      stats: [
        { label: 'Duration', value: 'Two hours', tag: 'Private' },
        { label: 'Sites', value: 'Three key works', tag: 'Guided' },
        { label: 'Group size', value: 'Your group only', tag: 'Exclusive' },
        { label: 'Guide', value: 'Architecture historian', tag: 'Expert' },
      ],
    },
    spa: {
      eyebrow: 'Day 2 · Late Afternoon',
      heading: 'THE POOL.',
      subheading: 'the Mediterranean, but vertical.',
      description: 'Hotel Arts\' outdoor infinity pool looks directly out over Barceloneta beach. On a July Saturday afternoon, this is the best seat in Barcelona — sun, water, poolside service, and the knowledge that Pacha starts in six hours.',
      features: ['Outdoor infinity pool', 'Barceloneta beach views', 'Sun terrace & loungers', 'Poolside bar service', 'Access to indoor spa facilities'],
    },
    diningExperiences: [
      { nightLabel: 'Night One', title: 'Gothic Quarter — Traditional Catalan Tapas', description: 'Friday dinner in the Gothic Quarter — one of Barcelona\'s oldest neighbourhoods, all narrow medieval streets and candlelit restaurants. Traditional Catalan food: pan amb tomàquet, patatas bravas, fresh seafood. The dinner that makes the city make sense.' },
      { nightLabel: 'Night Two', title: 'Eixample Fine Dining — Catalan Tasting Menu', description: 'Saturday\'s main dinner before Pacha. A contemporary Catalan tasting menu in the Eixample neighbourhood — eight courses exploring the depth of regional cuisine, with a wine flight focused on Priorat and Penedès.' },
    ],
    hosts: [
      { icon: 'Music', role: 'Nightlife Curator & VIP Lead', name: 'Your Club Host', bio: 'Barcelona native with a decade of experience across Pacha, Opium, and Razzmatazz. Gets your group in ahead of three-hour queues and manages the night from first drink to last sunrise.' },
      { icon: 'MapPin', role: 'City & Logistics Lead', name: 'Your City Host', bio: 'Coordinates all logistics — transfers, restaurant bookings, the Gaudí tour, and hotel operations from the moment you land to the moment you leave.' },
    ],
    photos: {
      cover: '1539037116277-4db20889f2d4',
      gallery: [
        { id: '1558370781-7b080e3fdc0f', caption: 'Sagrada Família towers' },
        { id: '1558618666-fcd25c85cd64', caption: 'Barcelona club interior' },
        { id: '1558618047-3c8d62e3f267', caption: 'Barceloneta beach sunset' },
        { id: '1543783207-ec64e4d88b85', caption: 'Gothic Quarter streets' },
        { id: '1559827261-e1d0e8a40f68', caption: 'Parc Güell mosaic detail' },
      ],
    },
  },

  // ── IBIZA ─────────────────────────────────────────────────────────────────────
  {
    slug: 'ibiza',
    destination: 'Ibiza',
    title: 'Ibiza VIP Weekend — August 2026',
    status: 'published',
    startDate: '2026-08-14',
    endDate: '2026-08-16',
    hotel: 'Nobu Hotel Ibiza Bay',
    clubNights: 'Ushuaïa · Pacha · DC-10',
    includes: 'Flights, transfers, hotel, club entry',
    spotsTotal: 25,
    spotsTaken: 22,
    priceFrom: 2800,
    deposit: 450,
    showMap: true,
    latitude: 38.9067,
    longitude: 1.4206,
    heroTagline: 'The White Isle, at its whitest and wildest. August is the only answer.',
    introText: [
      'Ibiza in August is the global clubbing calendar\'s peak. Every major DJ plays here in summer. The sunsets from Café del Mar are still the best in the world. The foam parties are larger than they should be. The energy is impossible to replicate anywhere else on earth.',
      'But Ibiza done wrong is exhausting and expensive. Done right — the right hotel, the right venues, the right hosts who know every promoter, every door policy, every late-night secret the island keeps — it\'s extraordinary.',
      'This is Ibiza done right.',
    ],
    summary: [
      'The White Isle at its August peak. Ushuaïa by day, Pacha and DC-10 by night. Twenty-five guests who came for the best weekend of their year.',
    ],
    inclusions: [
      { icon: 'Plane', title: 'Return Flights from the UK', sub: 'From major UK airports', detail: 'Direct return flights from London to Ibiza Airport, including taxes and cabin luggage.' },
      { icon: 'Hotel', title: 'Five-Star Hotel Accommodation', sub: 'Two nights, breakfast included', detail: 'Two nights at Nobu Hotel Ibiza Bay — a luxury beachfront resort on Talamanca Bay, a short drive from Ibiza Town.' },
      { icon: 'Bus', title: 'Private Airport Transfers', sub: 'IBZ to hotel and return', detail: 'Luxury minibus transfer from Ibiza Airport to Nobu and return.' },
      { icon: 'Music', title: 'VIP Club Entry — All Nights', sub: 'Three venues, no queue', detail: 'VIP access to Ushuaïa (Saturday daytime event), Pacha Ibiza (Friday), and DC-10 (Saturday night). All entry, all tables where applicable.' },
      { icon: 'Ship', title: 'Private Boat Day', sub: 'Saturday', detail: 'A full afternoon on a private catamaran — snorkelling coves, lunch on board, drinks, swimming off the coast of Formentera.' },
      { icon: 'Utensils', title: 'Welcome Dinner', sub: 'Friday evening', detail: 'Dinner at Nobu Ibiza Bay or a curated Ibiza Town restaurant — Japanese-Peruvian fusion or local Ibizan seafood.' },
      { icon: 'Users', title: 'Dedicated Partymoon Hosts', sub: 'With you the whole weekend', detail: 'Two experienced hosts, island-based, managing the full itinerary.' },
      { icon: 'ShieldCheck', title: 'Travel Insurance', sub: 'Full weekend coverage', detail: 'Comprehensive travel and cancellation insurance.' },
    ],
    itinerary: [
      { tag: 'Day 1 · Friday', day: 1, title: 'TOUCH DOWN. WHITE ISLE.', description: 'Transfer to Nobu Ibiza Bay. Settle in. Evening cocktails on the terrace watching Talamanca Bay. Dinner in Ibiza Town or at Nobu. Then Pacha: the original, the best, the one that defines what an Ibiza club night should feel like.' },
      { tag: 'Day 2 · Saturday', day: 2, title: 'BOAT. BEACH. USHUAÏA. DC-10.', description: 'The big day. Morning: pool or beach at the hotel. Afternoon: private catamaran to Formentera coves — snorkelling, lunch, swimming. Return by 5pm, get ready, then Ushuaïa for the sunset closing set — outdoor stage, international headliner. Then DC-10 for the night.' },
      { tag: 'Day 3 · Sunday', day: 3, title: 'LAST SWIM. LAST SIP. HOME.', description: 'Leisurely Sunday breakfast. One last swim in the bay. A slow drive through Ibiza Town. Transfers to the airport.' },
    ],
    clubs: [
      { badge: 'VIP · Legendary', name: 'Pacha Ibiza', vibe: 'House · Eclectic · VIP Booths', description: 'The original Pacha, opened in 1973 and still the most loved club on the island. The main room\'s circular dancefloor, the cherry motif, the Funky Room downstairs — Pacha is what every other club tries to be. Friday nights here are the island\'s most consistent experience.' },
      { badge: 'VIP · Open Air', name: 'Ushuaïa', vibe: 'Commercial · Open-air · International superstar DJs', description: 'The open-air festival-club that redefined what a daytime event could be. Three thousand capacity, international headliners every night of the week in August, foam cannons, and the island\'s biggest production values. The Saturday closing set is the weekend\'s centrepiece.' },
      { badge: 'VIP · Underground', name: 'DC-10', vibe: 'Techno · Balearic · Marathon sets', description: 'A small, raw club on the road to the airport that has produced the most influential underground nights on the island for thirty years. Circoloco on Mondays is legendary. Saturday night at DC-10 is a different, harder, more intense Ibiza than the beach clubs offer — and all the better for it.' },
    ],
    hotelOptions: [
      { tier: 'Signature Pick', name: 'Nobu Hotel Ibiza Bay', location: 'Talamanca Bay · North of Ibiza Town', features: ['Beachfront location on Talamanca Bay', 'Nobu Restaurant on-site', 'Outdoor pools with bay views', 'Spa & wellness centre', 'Water sports access'] },
      { tier: 'Design Favourite', name: 'Hacienda Na Xamena', location: 'North Ibiza · Clifftop', features: ['Original Ibiza luxury hotel since 1971', 'Cascading clifftop pools', 'Panoramic sea views', 'Remote location for maximum peace', 'Helicopter landing pad'] },
      { tier: 'Boutique Gem', name: 'Gran Hotel Montesol', location: 'Ibiza Town · Vara de Rey', features: ['Art Deco building in the heart of Ibiza Town', 'Landmark terrace bar', 'Walking distance from the marina', 'Beautifully restored period rooms', 'Steps from Dalt Vila'] },
    ],
    signatureExperience: {
      eyebrow: 'Day 2 · Saturday Afternoon',
      heading: 'THE BOAT DAY.',
      description: [
        'A private catamaran, your group, and the coast between Ibiza and Formentera. Saturday afternoon on the water is the best version of Ibiza that most people never find — clear water, hidden coves, lunch on deck, the mainland club noise completely out of range.',
        'Back in time for Ushuaïa. The contrast between the two halves of Saturday is the weekend\'s most memorable moment.',
      ],
      stats: [
        { label: 'Duration', value: 'Four hours', tag: 'Private' },
        { label: 'Capacity', value: 'Your group only', tag: 'Exclusive' },
        { label: 'Includes', value: 'Lunch, drinks & snorkelling', tag: 'Hosted' },
        { label: 'Route', value: 'Ibiza to Formentera', tag: 'Coastline' },
      ],
    },
    spa: {
      eyebrow: 'Day 1 · Friday Afternoon',
      heading: 'THE SPA.',
      subheading: 'arrive and decompress.',
      description: 'Nobu Ibiza Bay\'s spa offers treatments designed to reset after the flight and prepare for the weekend. Hammam, thermal journey, and a menu of body treatments using Ibizan botanicals. The pool terrace runs straight to the bay.',
      features: ['Hammam & thermal journey', 'Ibizan botanical treatments', 'Outdoor pool terrace on the bay', 'Relaxation lounge', 'In-room spa treatments available'],
    },
    diningExperiences: [
      { nightLabel: 'Night One', title: 'Nobu Ibiza Bay — Japanese-Peruvian', description: 'Friday dinner at Nobu — the world-famous Japanese-Peruvian restaurant right on the hotel terrace, with Talamanca Bay stretching out in front. Black cod miso, yellowtail sashimi, and cocktails before Pacha. The perfect Ibiza opening act.' },
      { nightLabel: 'Night Two', title: 'Sunset Dinner — Ibiza Town', description: 'Saturday dinner before Ushuaïa — quick, focused, a table at a restaurant near the venue. Fresh Ibizan seafood, local wines, maximum efficiency before the main event.' },
    ],
    hosts: [
      { icon: 'Music', role: 'Nightlife Curator & VIP Lead', name: 'Your Club Host', bio: 'Ibiza-based from May to October, with relationships across every major venue on the island. When Ushuaïa changes capacity and the queue at DC-10 goes to four hours, your host has already handled it.' },
      { icon: 'MapPin', role: 'Boat & Logistics Lead', name: 'Your Island Host', bio: 'Coordinates the boat day, transfers, restaurant bookings, and hotel logistics end to end. Island knowledge built over a decade of summers.' },
    ],
    photos: {
      cover: '1558618666-fcd25c85cd64',
      gallery: [
        { id: '1504700610630-ac6aba3536d3', caption: 'Ibiza sunset over the sea' },
        { id: '1516466723877-e4ec1d235372', caption: 'Ushuaïa open-air stage' },
        { id: '1565299507177-b0ac66763828', caption: 'Ibiza Town marina' },
        { id: '1534351590666-13e3e96b5017', caption: 'Private catamaran on clear water' },
        { id: '1510414842594-a61c69b5ae57', caption: 'White Ibiza architecture' },
      ],
    },
  },

  // ── MYKONOS ──────────────────────────────────────────────────────────────────
  {
    slug: 'mykonos',
    destination: 'Mykonos',
    title: 'Mykonos VIP Weekend — July 2026',
    status: 'published',
    startDate: '2026-07-24',
    endDate: '2026-07-26',
    hotel: 'Cavo Tagoo Mykonos',
    clubNights: 'Scorpios · Astra · Jackie O\'',
    includes: 'Flights, transfers, hotel, club entry',
    spotsTotal: 25,
    spotsTaken: 14,
    priceFrom: 3200,
    deposit: 500,
    showMap: true,
    latitude: 37.4467,
    longitude: 25.3289,
    heroTagline: 'The Cyclades at their most glamorous. Where the sea is impossibly blue and the night never ends.',
    introText: [
      'Mykonos is the Mediterranean\'s most glamorous island, and it has earned that reputation the hard way. Whitewashed cubic houses, windmills, and the most transparent water in the Aegean — and after sunset, a scene that pulls the global jet set back every summer without fail.',
      'The clubs here are not clubs in the conventional sense. Scorpios is a ritual. Jackie O\' is a statement. Astra is the island\'s best-kept secret. All three require the right introductions.',
      'We\'ve added a private yacht through the Cycladic coves, an afternoon in Little Venice, and dinner at a cliffside restaurant with views that make the Michelin stars redundant.',
    ],
    summary: [
      'The Greek islands at their most extravagant. Cavo Tagoo, private yacht, and the three venues that define Mediterranean summer nightlife.',
    ],
    inclusions: [
      { icon: 'Plane', title: 'Return Flights from the UK', sub: 'From major UK airports', detail: 'Return flights from London to Mykonos Island National Airport (JMK), including taxes and cabin luggage.' },
      { icon: 'Hotel', title: 'Five-Star Hotel Accommodation', sub: 'Two nights, breakfast included', detail: 'Two nights at Cavo Tagoo Mykonos — one of the finest boutique luxury hotels in the Cyclades, with a cave pool carved from the hillside above the sea.' },
      { icon: 'Bus', title: 'Private Airport Transfers', sub: 'JMK to hotel and return', detail: 'Private transfer from Mykonos Airport to Cavo Tagoo and return.' },
      { icon: 'Music', title: 'VIP Club Entry — All Nights', sub: 'Three venues, no queue', detail: 'VIP access to Scorpios, Astra, and Jackie O\' — Mykonos\'s three essential nightlife destinations.' },
      { icon: 'Sailboat', title: 'Private Yacht Charter', sub: 'Saturday', detail: 'A full afternoon on a private catamaran from Mykonos harbour — sailing to Delos, Rhenia, and the turquoise bays of the Cyclades. Lunch and drinks on board.' },
      { icon: 'Utensils', title: 'Cliffside Dinner', sub: 'Friday evening', detail: 'Dinner at a clifftop restaurant in Little Venice — grilled Mediterranean fish, Santorini wines, views that require no further description.' },
      { icon: 'Users', title: 'Dedicated Partymoon Hosts', sub: 'With you the whole weekend', detail: 'Two experienced hosts managing the full itinerary from landing to departure.' },
      { icon: 'ShieldCheck', title: 'Travel Insurance', sub: 'Full weekend coverage', detail: 'Comprehensive travel and cancellation insurance.' },
    ],
    itinerary: [
      { tag: 'Day 1 · Friday', day: 1, title: 'LAND. AEGEAN. LITTLE VENICE.', description: 'Transfer from Mykonos Airport to Cavo Tagoo. Check in, cave pool, and a first glimpse of the island from the hotel terrace. Evening drinks in Little Venice, watching the sun set over the windmills. Dinner at a cliffside restaurant on the waterfront. Night: Scorpios for the sunset session.' },
      { tag: 'Day 2 · Saturday', day: 2, title: 'CYCLADES BY YACHT. ASTRA BY NIGHT.', description: 'Morning at leisure — breakfast on the terrace, hotel pool, the island waking up. Afternoon: private yacht charter through the Cycladic sea — Delos, Rhenia, swimming off the boat in water you don\'t see anywhere else in Europe. Return at sunset. Dinner. Then Astra: the island\'s finest terrace club, with views of the bay and a crowd that comes for the music.' },
      { tag: 'Day 3 · Sunday', day: 3, title: 'ONE LAST MEZZE. FAREWELL.', description: 'Late brunch in Mykonos Town. A slow walk through the Kastro neighbourhood. Jackie O\' for the Sunday afternoon session if the group has more to give. Transfers to the airport.' },
    ],
    clubs: [
      { badge: 'VIP · Ritual', name: 'Scorpios', vibe: 'Balearic · World · Ceremonial sunset', description: 'More ritual than nightclub, Scorpios has built one of the most devoted followings in the Mediterranean. A beach club that transforms at sunset into something genuinely spiritual — deep Balearic music, a crowd that dances in the sea, and a production that has been refined for a decade.' },
      { badge: 'VIP · Terrace', name: 'Astra', vibe: 'House · Electronic · Clifftop terrace', description: 'The island\'s best-kept secret — a terrace club in the hills above Mykonos Town with panoramic sea views and a booking policy that keeps quality high. Astra plays deeper, more considered music than the beachfront venues, with a crowd that has graduated from the tourist circuit.' },
      { badge: 'VIP · Waterfront', name: 'Jackie O\'', vibe: 'Commercial · Party · Aegean views', description: 'The most famous beach bar on the island, on the road to Super Paradise Beach. Jackie O\' plays a crowd-pleasing mix of commercial house and popular electronic music in the most spectacular open-air setting on the island. The Sunday afternoon session is a Mykonos institution.' },
    ],
    hotelOptions: [
      { tier: 'Signature Pick', name: 'Cavo Tagoo Mykonos', location: 'Tagoo · Above Mykonos Town', features: ['Cave pool carved from the hillside', 'Panoramic Aegean views', 'Cavo Tagoo restaurant (destination dining)', 'Helicopter pad', 'Suites with private plunge pools'] },
      { tier: 'Design Favourite', name: 'Katikies Mykonos', location: 'Agios Ioannis · Southwest Coast', features: ['Infinity pool with Delos views', 'Cycladic architecture', 'Agora restaurant', 'Couples-focused intimate atmosphere', 'Private beach access'] },
      { tier: 'Boutique Gem', name: 'Bill & Coo Suites & Lounge', location: 'Megali Ammos · South Coast', features: ['Private plunge pools in each suite', 'Michelin-starred restaurant', 'Absolute sea views', 'Small 35-suite property', 'Steps from Mykonos Town'] },
    ],
    signatureExperience: {
      eyebrow: 'Day 2 · Saturday Afternoon',
      heading: 'THE YACHT CHARTER.',
      description: [
        'A private catamaran from Mykonos harbour into the Cycladic sea. Saturday afternoon belongs to the water — the ancient island of Delos on the horizon, the uninhabited coves of Rhenia for swimming, and the kind of light over the Aegean that makes every other sea look ordinary.',
        'Lunch on deck, snorkelling, and the silence that only the open sea provides before a Saturday night at Astra.',
      ],
      stats: [
        { label: 'Duration', value: 'Five hours', tag: 'Private' },
        { label: 'Islands', value: 'Delos & Rhenia', tag: 'Exclusive' },
        { label: 'Includes', value: 'Lunch, drinks & snorkelling', tag: 'Hosted' },
        { label: 'Capacity', value: 'Your group only', tag: 'Cyclades' },
      ],
    },
    spa: {
      eyebrow: 'Day 1 · Friday Afternoon',
      heading: 'THE CAVE POOL.',
      subheading: 'the sea, but inside the rock.',
      description: 'Cavo Tagoo\'s signature cave pool is carved directly from the hillside, fed with seawater and opening over the Aegean. Arrive Friday afternoon, order a drink, and let the fact that you\'re in Mykonos settle in before the weekend begins.',
      features: ['Signature cave pool (seawater)', 'Panoramic Aegean views', 'Poolside cocktail service', 'Thermal treatments available', 'In-suite private plunge pools (select rooms)'],
    },
    diningExperiences: [
      { nightLabel: 'Night One', title: 'Little Venice — Cliffside Mezze', description: 'Friday dinner in Little Venice, Mykonos Town\'s most scenic neighbourhood. A long table above the water, fresh mezze — grilled octopus, feta with honey, taramasalata — and Santorini Assyrtiko as the sun drops behind the windmills.' },
      { nightLabel: 'Night Two', title: 'Cavo Tagoo Restaurant — Aegean Fine Dining', description: 'Saturday dinner at the hotel\'s signature restaurant before Astra. A contemporary Greek menu built around the same Cycladic ingredients that have sustained the islands for three thousand years — but with a kitchen that knows exactly what it\'s doing.' },
    ],
    hosts: [
      { icon: 'Music', role: 'Nightlife Curator & VIP Lead', name: 'Your Club Host', bio: 'Mykonos-based from May to September with long-term relationships across Scorpios, Astra, Jackie O\', and the island\'s promoter network. Handles every door, every table, every island complication before you know about it.' },
      { icon: 'Sailboat', role: 'Yacht & Logistics Lead', name: 'Your Island Host', bio: 'Coordinates the yacht charter, transfers, restaurant bookings, and hotel operations from arrival to departure. Greek island expertise built over eight consecutive summers.' },
    ],
    photos: {
      cover: '1533105079780-92b9be482077',
      gallery: [
        { id: '1601581975053-7655b293f3e4', caption: 'Mykonos windmills at sunset' },
        { id: '1568322426532-9e65bfc8e89c', caption: 'Cavo Tagoo cave pool' },
        { id: '1534351590666-13e3e96b5017', caption: 'Aegean sea from the yacht' },
        { id: '1590523277543-a94d2e4eb00b', caption: 'Little Venice waterfront' },
        { id: '1516466723877-e4ec1d235372', caption: 'Scorpios at sunset' },
      ],
    },
  },
]

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🚀 PartyMoon CMS seed script')
  console.log('   Project: a6wgzngo  Dataset: production\n')

  // 1. Delete all existing trip documents
  console.log('🗑  Deleting existing trips...')
  const existing = await sanity.fetch<Array<{ _id: string }>>('*[_type == "trip"]{ _id }')
  if (existing.length > 0) {
    const tx = sanity.transaction()
    for (const doc of existing) tx.delete(doc._id)
    await tx.commit()
    console.log(`   Deleted ${existing.length} trip(s)\n`)
  } else {
    console.log('   No existing trips found\n')
  }

  // 2. Create each trip
  for (const trip of TRIPS) {
    const docId = sanityId(trip.slug)
    console.log(`→ Creating ${trip.destination} (${docId})`)

    // Upload cover image
    let coverAssetId: string | null = null
    if (trip.photos.cover) {
      coverAssetId = await uploadUnsplashPhoto(trip.photos.cover, `${trip.destination} — Partymoon VIP weekend`)
    }

    // Upload gallery images
    const galleryItems: Array<{ _key: string; image?: ReturnType<typeof imageRef>; caption?: string }> = []
    for (const g of trip.photos.gallery) {
      const assetId = await uploadUnsplashPhoto(g.id, g.caption)
      if (assetId) {
        galleryItems.push({ _key: randomKey(), image: imageRef(assetId, g.caption), caption: g.caption })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = {
      _type: 'trip',
      _id: docId,
      title: trip.title,
      slug: { _type: 'slug', current: trip.slug },
      destination: trip.destination,
      status: trip.status,
      showMap: trip.showMap,
      latitude: trip.latitude,
      longitude: trip.longitude,
      startDate: trip.startDate,
      endDate: trip.endDate,
      hotel: trip.hotel,
      clubNights: trip.clubNights,
      includes: trip.includes,
      spotsTotal: trip.spotsTotal,
      spotsTaken: trip.spotsTaken,
      priceFrom: trip.priceFrom,
      deposit: trip.deposit,
      heroTagline: trip.heroTagline,
      introText: pt(trip.introText),
      summary: pt(trip.summary),
      inclusions: trip.inclusions.map((inc) => ({
        _key: randomKey(),
        icon: inc.icon,
        title: inc.title,
        sub: inc.sub,
        detail: inc.detail,
      })),
      itinerary: trip.itinerary.map((it) => ({
        _key: randomKey(),
        tag: it.tag,
        day: it.day,
        title: it.title,
        description: it.description,
      })),
      clubs: trip.clubs.map((c) => ({
        _key: randomKey(),
        badge: c.badge,
        name: c.name,
        vibe: c.vibe,
        description: c.description,
      })),
      hotelOptions: trip.hotelOptions.map((h) => ({
        _key: randomKey(),
        tier: h.tier,
        name: h.name,
        location: h.location,
        features: h.features.map((f) => ({ _key: randomKey(), feature: f })),
      })),
      signatureExperience: {
        eyebrow: trip.signatureExperience.eyebrow,
        heading: trip.signatureExperience.heading,
        description: pt(trip.signatureExperience.description),
        stats: trip.signatureExperience.stats.map((s) => ({
          _key: randomKey(),
          label: s.label,
          value: s.value,
          tag: s.tag,
        })),
      },
      spa: {
        eyebrow: trip.spa.eyebrow,
        heading: trip.spa.heading,
        subheading: trip.spa.subheading,
        description: trip.spa.description,
        features: trip.spa.features.map((f) => ({ _key: randomKey(), feature: f })),
      },
      diningExperiences: trip.diningExperiences.map((d) => ({
        _key: randomKey(),
        nightLabel: d.nightLabel,
        title: d.title,
        description: d.description,
      })),
      hosts: trip.hosts.map((h) => ({
        _key: randomKey(),
        icon: h.icon,
        role: h.role,
        name: h.name,
        bio: h.bio,
      })),
      gallery: galleryItems.length > 0 ? galleryItems : undefined,
    }

    if (coverAssetId) {
      doc.coverImage = imageRef(coverAssetId, `${trip.destination} — Partymoon VIP weekend`)
    }

    try {
      await sanity.createOrReplace(doc)
      console.log(`  ✓ Created ${docId}${coverAssetId ? ' (with cover image)' : ' (gradient fallback — no cover image)'}\n`)
    } catch (err) {
      console.error(`  ✗ Failed to create ${docId}:`, err)
    }
  }

  console.log('✅ Seed complete — 6 trips created in Sanity')
  console.log('\nNote: If cover images failed to upload, the app uses gradient fallbacks.')
  console.log('To use Unsplash images, ensure the photo IDs in the script resolve on the CDN.')
}

seed().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
