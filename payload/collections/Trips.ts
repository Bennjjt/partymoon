import type { CollectionConfig } from 'payload'

export const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'destination', 'startDate', 'status', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ── Core identity ────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Internal name, e.g. "Ibiza VIP Weekend — May 2026"' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL path — lowercase, no spaces. e.g. "ibiza". Used at /ibiza.',
      },
    },
    {
      name: 'destination',
      type: 'text',
      required: true,
      admin: { description: 'Display label on the card and detail page, e.g. "Ibiza" or "Amalfi Coast"' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },

    // ── Map ──────────────────────────────────────────────────────
    {
      name: 'showMap',
      label: 'Show map',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Display an interactive location map on the trip detail page.',
      },
    },
    {
      name: 'latitude',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Decimal latitude for the map pin. e.g. 38.9067',
      },
    },
    {
      name: 'longitude',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Decimal longitude for the map pin. e.g. 1.4206',
      },
    },

    // ── Cover image ──────────────────────────────────────────────
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Required before a trip goes live. Without a cover image the card shows a gradient placeholder.',
      },
    },

    // ── Dates ────────────────────────────────────────────────────
    {
      name: 'startDate',
      label: 'Start date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMMM yyyy' },
        description: 'First day of the trip (usually a Friday).',
      },
    },
    {
      name: 'endDate',
      label: 'End date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMMM yyyy' },
        description: 'Last day of the trip (usually a Sunday).',
      },
    },

    // ── Card details ─────────────────────────────────────────────
    {
      name: 'hotel',
      type: 'text',
      admin: { description: 'Confirmed hotel name shown on the trip card. e.g. "Gran Hotel Montesol"' },
    },
    {
      name: 'clubNights',
      label: 'Club nights (card)',
      type: 'text',
      admin: { description: 'Short venue summary for the trip card. e.g. "Pacha + Ushuaïa". Use the Clubs array below for full detail-page content.' },
    },
    {
      name: 'includes',
      type: 'text',
      admin: { description: 'One-line inclusions summary for the trip card. e.g. "Flights, transfers". Use the Inclusions array below for full detail-page content.' },
    },

    // ── Capacity ─────────────────────────────────────────────────
    {
      name: 'spotsTotal',
      label: 'Total spots',
      type: 'number',
      defaultValue: 25,
      min: 1,
      admin: {
        position: 'sidebar',
        description: 'Maximum group size for this trip.',
      },
    },
    {
      name: 'spotsTaken',
      label: 'Spots taken',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Update manually for now. Will be auto-calculated from confirmed Bookings in a future release.',
      },
    },

    // ── Pricing — single source of truth ────────────────────────
    // priceFrom and deposit are the only price fields in the schema.
    // No other field should store a monetary value.
    {
      name: 'priceFrom',
      label: 'Price from (£)',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Per-person starting price in whole pounds. e.g. £2,200 → enter 2200. This is the single price reference used across all components.',
      },
    },
    {
      name: 'deposit',
      label: 'Deposit (£)',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Per-person deposit in whole pounds. e.g. £300 → enter 300.',
      },
    },

    // ── Detail page — Hero & Intro ───────────────────────────────
    {
      name: 'heroTagline',
      label: 'Hero tagline',
      type: 'textarea',
      admin: {
        description: 'Short italic sentence shown beneath the destination name in the hero. Sets the emotional tone. e.g. "The weekend where the canals shimmer gold, the clubs never sleep…"',
      },
    },
    {
      name: 'introText',
      label: 'Intro body text',
      type: 'richText',
      admin: {
        description: 'Longer destination narrative shown in the "The Partymoon Way" intro section. 2–3 paragraphs describing what makes this city/trip exceptional.',
      },
    },

    // ── Detail page — Inclusions ─────────────────────────────────
    {
      name: 'inclusions',
      label: 'Inclusions (detail page)',
      type: 'array',
      admin: {
        description: 'Structured list of everything included. Powers the "What\'s In It" detail grid and the "All Included" icon grid on the trip page. Do not add pricing here — pricing lives in the Price fields above.',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: { description: 'Emoji representing the inclusion. e.g. ✈️' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'Inclusion headline. e.g. "Return Flights from the UK"' },
        },
        {
          name: 'sub',
          label: 'Subtitle',
          type: 'text',
          admin: { description: 'Short supporting detail (no prices). e.g. "From major UK airports"' },
        },
        {
          name: 'detail',
          type: 'textarea',
          admin: { description: 'Optional longer description shown in the "What\'s In It" expanded grid.' },
        },
      ],
    },

    // ── Detail page — Itinerary ──────────────────────────────────
    {
      name: 'itinerary',
      type: 'array',
      admin: {
        description: 'Phase-by-phase weekend breakdown shown on the detail page.',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          admin: { description: 'Phase label shown above the heading. e.g. "Day 1 · Arrival" or "Day 2 · Late Night"' },
        },
        {
          name: 'day',
          type: 'number',
          required: true,
          admin: { description: 'Day number for ordering (1, 2, 3). Used as the large background number.' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'Itinerary heading in Caps. e.g. "TOUCH DOWN. CHAMPAGNE UP."' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Full descriptive paragraph for this phase.' },
        },
      ],
    },

    // ── Detail page — Clubs ──────────────────────────────────────
    {
      name: 'clubs',
      type: 'array',
      admin: {
        description: 'VIP club night entries for the detail page. Typically 2–4 clubs. The two nights\' venues are chosen from this list.',
      },
      fields: [
        {
          name: 'badge',
          type: 'text',
          admin: { description: 'Short descriptor pill. e.g. "VIP · Waterfront"' },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'Club name. e.g. "Club Panama"' },
        },
        {
          name: 'vibe',
          type: 'text',
          admin: { description: 'Music genre / atmosphere line. e.g. "House · Techno · International DJs"' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Club description paragraph.' },
        },
      ],
    },

    // ── Detail page — Hotel options ──────────────────────────────
    {
      name: 'hotelOptions',
      label: 'Hotel options (detail page)',
      type: 'array',
      admin: {
        description: 'Showcase of 2–3 curated hotels for this destination. These are the properties Partymoon selects from — the confirmed hotel for any given trip is in the "Hotel (card)" field above.',
      },
      fields: [
        {
          name: 'tier',
          type: 'text',
          admin: { description: 'Tier label. e.g. "Signature Pick" or "Design Favourite"' },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'Hotel name. e.g. "Waldorf Astoria Amsterdam"' },
        },
        {
          name: 'location',
          type: 'text',
          admin: { description: 'Neighbourhood / area. e.g. "Herengracht · Canal Belt"' },
        },
        {
          name: 'features',
          type: 'array',
          admin: { description: 'Feature bullet points for this hotel.' },
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    // ── Detail page — Signature experience ──────────────────────
    // Named generically so it works across all destinations
    // (canal cruise in Amsterdam, yacht in Monaco, boat in Amalfi, etc.)
    {
      name: 'signatureExperience',
      label: 'Signature experience',
      type: 'group',
      admin: {
        description: 'The marquee mid-trip activity featured in its own section. e.g. Canal cruise (Amsterdam), private yacht (Monaco), gozzo boat day (Amalfi).',
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: { description: 'Small label above the heading. e.g. "Day 2 · Afternoon"' },
        },
        {
          name: 'heading',
          type: 'text',
          admin: { description: 'Section heading. e.g. "THE CANAL CRUISE."' },
        },
        {
          name: 'description',
          type: 'richText',
          admin: { description: 'Full description of the experience.' },
        },
        {
          name: 'stats',
          type: 'array',
          admin: { description: 'Key facts shown in the stats panel alongside the description.' },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "Duration"' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "Two full hours on the water"' },
            },
            {
              name: 'tag',
              type: 'text',
              admin: { description: 'Small pill label. e.g. "Private"' },
            },
          ],
        },
      ],
    },

    // ── Detail page — Spa ────────────────────────────────────────
    {
      name: 'spa',
      type: 'group',
      admin: {
        description: 'Spa / wellness section content for the detail page.',
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: { description: 'e.g. "Day 2 · Late Afternoon"' },
        },
        {
          name: 'heading',
          type: 'text',
          admin: { description: 'e.g. "THE SPA."' },
        },
        {
          name: 'subheading',
          label: 'Subheading (italic)',
          type: 'text',
          admin: { description: 'e.g. "because Night Two deserves it."' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Main descriptive paragraph.' },
        },
        {
          name: 'features',
          type: 'array',
          admin: { description: 'Feature bullet list. e.g. "Heated indoor pool", "Steam room & sauna"' },
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    // ── Detail page — Dining ─────────────────────────────────────
    {
      name: 'diningExperiences',
      label: 'Dining experiences',
      type: 'array',
      admin: {
        description: 'The dining evenings on the trip. Typically two entries: one local/casual, one fine dining.',
      },
      fields: [
        {
          name: 'nightLabel',
          label: 'Night label',
          type: 'text',
          admin: { description: 'e.g. "Night One" or "Night Two"' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Local Dutch Cuisine — The Real Amsterdam"' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Full description of the dining experience.' },
        },
      ],
    },

    // ── Detail page — Hosts ──────────────────────────────────────
    {
      name: 'hosts',
      type: 'array',
      admin: {
        description: 'The dedicated hosts for this trip. Typically two entries.',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: { description: 'Emoji representing this host\'s role. e.g. 🎶' },
        },
        {
          name: 'role',
          type: 'text',
          admin: { description: 'Role title. e.g. "Nightlife Curator & VIP Lead"' },
        },
        {
          name: 'name',
          type: 'text',
          admin: { description: 'Display name. e.g. "Your Club Host"' },
        },
        {
          name: 'bio',
          type: 'textarea',
          admin: { description: 'Short biography paragraph.' },
        },
      ],
    },

    // ── Detail page — Gallery ────────────────────────────────────
    {
      name: 'gallery',
      type: 'array',
      admin: {
        description: 'Images and videos shown in the gallery on the detail page. Each item is either an image upload OR a video URL.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Upload an image. Leave blank if using a video URL instead.',
          },
        },
        {
          name: 'videoUrl',
          label: 'Video URL',
          type: 'text',
          admin: {
            description: 'Direct MP4 link for auto-playing video. Takes priority over image if both are set.',
          },
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },

    // ── Detail page — Summary ────────────────────────────────────
    {
      name: 'summary',
      type: 'richText',
      admin: {
        description: 'Intro paragraph shown at the top of the trip detail page (above the itinerary).',
      },
    },
  ],
}
