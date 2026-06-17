import {defineType, defineField, defineArrayMember} from 'sanity'
import {RocketIcon} from '@sanity/icons'

export const tripType = defineType({
  name: 'trip',
  title: 'Trip',
  type: 'document',
  icon: RocketIcon,
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'dates', title: 'Dates & Pricing'},
    {name: 'detail', title: 'Detail Page'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    // ── Core identity ────────────────────────────────────────────
    defineField({
      name: 'title',
      type: 'string',
      group: 'identity',
      description: 'Internal name, e.g. "Ibiza VIP Weekend — May 2026"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'identity',
      options: {source: 'title'},
      description: 'URL path — lowercase, no spaces. e.g. "ibiza". Used at /ibiza.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'destination',
      type: 'string',
      group: 'identity',
      description: 'Display label on the card and detail page, e.g. "Ibiza" or "Amalfi Coast"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      group: 'settings',
      initialValue: 'draft',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),

    // ── Map ──────────────────────────────────────────────────────
    defineField({
      name: 'showMap',
      title: 'Show map',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Display an interactive location map on the trip detail page.',
    }),
    defineField({
      name: 'latitude',
      type: 'number',
      group: 'settings',
      description: 'Decimal latitude for the map pin. e.g. 38.9067',
      hidden: ({document}) => !document?.showMap,
    }),
    defineField({
      name: 'longitude',
      type: 'number',
      group: 'settings',
      description: 'Decimal longitude for the map pin. e.g. 1.4206',
      hidden: ({document}) => !document?.showMap,
    }),

    // ── Cover image ──────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      type: 'image',
      group: 'identity',
      options: {hotspot: true},
      description:
        'Required before a trip goes live. Without a cover image the card shows a gradient placeholder.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (rule) => rule.required().warning('Alt text is important for accessibility'),
        }),
      ],
    }),

    // ── Dates ────────────────────────────────────────────────────
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      group: 'dates',
      description: 'First day of the trip (usually a Friday).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      group: 'dates',
      description: 'Last day of the trip (usually a Sunday).',
      validation: (rule) =>
        rule.required().custom((endDate, ctx) => {
          const startDate = (ctx.document as {startDate?: string} | undefined)?.startDate
          if (startDate && endDate && endDate < startDate) {
            return 'End date must be after start date'
          }
          return true
        }),
    }),

    // ── Card summary fields ──────────────────────────────────────
    defineField({
      name: 'hotel',
      type: 'string',
      group: 'identity',
      description:
        'Confirmed hotel name shown on the trip card. e.g. "Gran Hotel Montesol"',
    }),
    defineField({
      name: 'clubNights',
      title: 'Club nights (card)',
      type: 'string',
      group: 'identity',
      description:
        'Short venue summary for the trip card. e.g. "Pacha + Ushuaïa". Use the Clubs array below for full detail-page content.',
    }),
    defineField({
      name: 'includes',
      type: 'string',
      group: 'identity',
      description:
        'One-line inclusions summary for the trip card. e.g. "Flights, transfers". Use the Inclusions array below for full detail-page content.',
    }),

    // ── Capacity ─────────────────────────────────────────────────
    defineField({
      name: 'spotsTotal',
      title: 'Total spots',
      type: 'number',
      group: 'settings',
      initialValue: 25,
      validation: (rule) => rule.required().min(1),
      description: 'Maximum group size for this trip.',
    }),
    defineField({
      name: 'spotsTaken',
      title: 'Spots taken',
      type: 'number',
      group: 'settings',
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
      description:
        'Update manually for now. Will be auto-calculated from confirmed Bookings in a future release.',
    }),

    // ── Pricing ──────────────────────────────────────────────────
    defineField({
      name: 'priceFrom',
      title: 'Price from (£)',
      type: 'number',
      group: 'dates',
      validation: (rule) => rule.required().min(0),
      description:
        'Per-person starting price in whole pounds. e.g. £2,200 → enter 2200.',
    }),
    defineField({
      name: 'deposit',
      title: 'Deposit (£)',
      type: 'number',
      group: 'dates',
      validation: (rule) => rule.required().min(0),
      description: 'Per-person deposit in whole pounds. e.g. £300 → enter 300.',
    }),

    // ── Detail page — Hero & Intro ───────────────────────────────
    defineField({
      name: 'heroTagline',
      title: 'Hero tagline',
      type: 'text',
      rows: 3,
      group: 'detail',
      description:
        'Short italic sentence shown beneath the destination name in the hero. Sets the emotional tone.',
    }),
    defineField({
      name: 'introText',
      title: 'Intro body text',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      group: 'detail',
      description:
        'Longer destination narrative shown in the "The Partymoon Way" intro section. 2–3 paragraphs.',
    }),
    defineField({
      name: 'summary',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      group: 'detail',
      description: 'Intro paragraph shown at the top of the trip detail page (above the itinerary).',
    }),

    // ── Detail page — Inclusions ─────────────────────────────────
    defineField({
      name: 'inclusions',
      title: 'Inclusions (detail page)',
      type: 'array',
      group: 'detail',
      description:
        "Structured list of everything included. Powers the 'What's In It' detail grid and the 'All Included' icon grid.",
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              type: 'string',
              description: 'Lucide icon name. e.g. "Plane", "BedDouble", "Hotel", "Bus", "Music", "Ship", "Sailboat", "Utensils", "Users", "ShieldCheck", "Bike", "Landmark", "Waves", "MapPin", "Umbrella"',
            }),
            defineField({
              name: 'title',
              type: 'string',
              description: 'Inclusion headline. e.g. "Return Flights from the UK"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'sub',
              title: 'Subtitle',
              type: 'string',
              description: 'Short supporting detail. e.g. "From major UK airports"',
            }),
            defineField({
              name: 'detail',
              type: 'text',
              rows: 3,
              description: "Optional longer description shown in the 'What's In It' expanded grid.",
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'sub', media: 'icon'},
            prepare({title, subtitle}) {
              return {title, subtitle}
            },
          },
        }),
      ],
    }),

    // ── Detail page — Itinerary ──────────────────────────────────
    defineField({
      name: 'itinerary',
      type: 'array',
      group: 'detail',
      description: 'Phase-by-phase weekend breakdown shown on the detail page.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'tag',
              type: 'string',
              description:
                'Phase label shown above the heading. e.g. "Day 1 · Arrival" or "Day 2 · Late Night"',
            }),
            defineField({
              name: 'day',
              type: 'number',
              description: 'Day number for ordering (1, 2, 3). Used as the large background number.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              type: 'string',
              description: 'Itinerary heading in Caps. e.g. "TOUCH DOWN. CHAMPAGNE UP."',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 4,
              description: 'Full descriptive paragraph for this phase.',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'tag'},
            prepare({title, subtitle}) {
              return {title, subtitle}
            },
          },
        }),
      ],
    }),

    // ── Detail page — Clubs ──────────────────────────────────────
    defineField({
      name: 'clubs',
      type: 'array',
      group: 'detail',
      description:
        'VIP club night entries for the detail page. Typically 2–4 clubs.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'badge',
              type: 'string',
              description: 'Short descriptor pill. e.g. "VIP · Waterfront"',
            }),
            defineField({
              name: 'name',
              type: 'string',
              description: 'Club name. e.g. "Club Panama"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'vibe',
              type: 'string',
              description:
                'Music genre / atmosphere line. e.g. "House · Techno · International DJs"',
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 3,
              description: 'Club description paragraph.',
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'badge'},
            prepare({title, subtitle}) {
              return {title, subtitle}
            },
          },
        }),
      ],
    }),

    // ── Detail page — Hotel options ──────────────────────────────
    defineField({
      name: 'hotelOptions',
      title: 'Hotel options (detail page)',
      type: 'array',
      group: 'detail',
      description:
        'Showcase of 2–3 curated hotels for this destination.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'tier',
              type: 'string',
              description: 'Tier label. e.g. "Signature Pick" or "Design Favourite"',
            }),
            defineField({
              name: 'name',
              type: 'string',
              description: 'Hotel name. e.g. "Waldorf Astoria Amsterdam"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'location',
              type: 'string',
              description: 'Neighbourhood / area. e.g. "Herengracht · Canal Belt"',
            }),
            defineField({
              name: 'features',
              type: 'array',
              description: 'Feature bullet points for this hotel.',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'feature',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: {title: 'feature'},
                    prepare({title}) {
                      return {title}
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'tier'},
            prepare({title, subtitle}) {
              return {title, subtitle}
            },
          },
        }),
      ],
    }),

    // ── Detail page — Signature experience ──────────────────────
    defineField({
      name: 'signatureExperience',
      title: 'Signature experience',
      type: 'object',
      group: 'detail',
      description:
        'The marquee mid-trip activity featured in its own section. e.g. Canal cruise (Amsterdam), private yacht (Monaco), gozzo boat day (Amalfi).',
      fields: [
        defineField({
          name: 'eyebrow',
          type: 'string',
          description: 'Small label above the heading. e.g. "Day 2 · Afternoon"',
        }),
        defineField({
          name: 'heading',
          type: 'string',
          description: 'Section heading. e.g. "THE CANAL CRUISE."',
        }),
        defineField({
          name: 'description',
          type: 'array',
          of: [defineArrayMember({type: 'block'})],
          description: 'Full description of the experience.',
        }),
        defineField({
          name: 'stats',
          type: 'array',
          description: 'Key facts shown in the stats panel alongside the description.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'label',
                  type: 'string',
                  description: 'e.g. "Duration"',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'value',
                  type: 'string',
                  description: 'e.g. "Two full hours on the water"',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'tag',
                  type: 'string',
                  description: 'Small pill label. e.g. "Private"',
                }),
              ],
              preview: {
                select: {title: 'label', subtitle: 'value'},
                prepare({title, subtitle}) {
                  return {title, subtitle}
                },
              },
            }),
          ],
        }),
      ],
    }),

    // ── Detail page — Spa ────────────────────────────────────────
    defineField({
      name: 'spa',
      type: 'object',
      group: 'detail',
      description: 'Spa / wellness section content for the detail page.',
      fields: [
        defineField({
          name: 'eyebrow',
          type: 'string',
          description: 'e.g. "Day 2 · Late Afternoon"',
        }),
        defineField({
          name: 'heading',
          type: 'string',
          description: 'e.g. "THE SPA."',
        }),
        defineField({
          name: 'subheading',
          title: 'Subheading (italic)',
          type: 'string',
          description: 'e.g. "because Night Two deserves it."',
        }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 4,
          description: 'Main descriptive paragraph.',
        }),
        defineField({
          name: 'features',
          type: 'array',
          description: 'Feature bullet list. e.g. "Heated indoor pool", "Steam room & sauna"',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'feature',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: {title: 'feature'},
                prepare({title}) {
                  return {title}
                },
              },
            }),
          ],
        }),
      ],
    }),

    // ── Detail page — Dining ─────────────────────────────────────
    defineField({
      name: 'diningExperiences',
      title: 'Dining experiences',
      type: 'array',
      group: 'detail',
      description:
        'The dining evenings on the trip. Typically two entries: one local/casual, one fine dining.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'nightLabel',
              title: 'Night label',
              type: 'string',
              description: 'e.g. "Night One" or "Night Two"',
            }),
            defineField({
              name: 'title',
              type: 'string',
              description: 'e.g. "Local Dutch Cuisine — The Real Amsterdam"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 3,
              description: 'Full description of the dining experience.',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'nightLabel'},
            prepare({title, subtitle}) {
              return {title, subtitle}
            },
          },
        }),
      ],
    }),

    // ── Detail page — Hosts ──────────────────────────────────────
    defineField({
      name: 'hosts',
      type: 'array',
      group: 'detail',
      description: 'The dedicated hosts for this trip. Typically two entries.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              type: 'string',
              description: 'Lucide icon name representing this host\'s role. e.g. "Music", "MapPin", "Users", "Sparkle"',
            }),
            defineField({
              name: 'role',
              type: 'string',
              description: 'Role title. e.g. "Nightlife Curator & VIP Lead"',
            }),
            defineField({
              name: 'name',
              type: 'string',
              description: 'Display name. e.g. "Your Club Host"',
            }),
            defineField({
              name: 'bio',
              type: 'text',
              rows: 3,
              description: 'Short biography paragraph.',
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'role'},
            prepare({title, subtitle}) {
              return {title, subtitle}
            },
          },
        }),
      ],
    }),

    // ── Detail page — Gallery ────────────────────────────────────
    defineField({
      name: 'gallery',
      type: 'array',
      group: 'detail',
      description:
        'Images and videos shown in the gallery on the detail page. Each item is either an image upload OR a video URL.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              options: {hotspot: true},
              description: 'Upload an image. Leave blank if using a video URL instead.',
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alt text',
                }),
              ],
            }),
            defineField({
              name: 'videoUrl',
              title: 'Video URL',
              type: 'url',
              description:
                'Direct MP4 link for auto-playing video. Takes priority over image if both are set.',
            }),
            defineField({
              name: 'caption',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'caption', media: 'image'},
            prepare({title, media}) {
              return {title: title || 'Gallery item', media}
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'destination',
      media: 'coverImage',
    },
    prepare({title, subtitle, media}) {
      return {title, subtitle, media}
    },
  },
})
