'use client'

import { motion } from 'framer-motion'

interface Package {
  name: string
  price: string
  badge?: string
  featured?: boolean
  dotAccent?: 'purple' | 'gold'
  features: string[]
}

const PACKAGES: Package[] = [
  {
    name: 'Essential',
    price: '£2,200',
    features: [
      'Return flights included',
      'Five-star hotel, 2 nights',
      'VIP table, 1 club night',
      'Airport transfers both ways',
      'Dedicated Partymoon host',
      'Pre-trip itinerary pack',
    ],
  },
  {
    name: 'Premium',
    price: '£3,500',
    badge: 'Most popular',
    featured: true,
    features: [
      'Return flights included',
      'Five-star hotel, 2 nights',
      'VIP tables, 2 club nights',
      'All transfers + private dining',
      'Beach or pool club day',
      'Welcome champagne on arrival',
      'Dedicated host all weekend',
    ],
  },
  {
    name: 'Ultimate',
    price: '£6,000',
    dotAccent: 'gold',
    features: [
      'Private charter flights',
      'Suite upgrade, 3 nights',
      'VIP tables, every night',
      'Yacht or villa day experience',
      'Personal concierge 24/7',
      'Private chef dinner, 1 night',
      'Everything. Every detail.',
    ],
  },
]

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function PackagesSection() {
  return (
    <section className="px-6 md:px-12 py-24" style={{ background: 'var(--pm-deep)' }} id="packages">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={headingVariants}
      >
        <p
          className="text-[0.6rem] tracking-[0.35em] uppercase mb-3"
          style={{ color: 'var(--pm-purple-light)' }}
        >
          What&apos;s included
        </p>
        <h2
          className="font-heading font-light leading-[1.2] mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          Choose your <em className="italic">package</em>
        </h2>
        <p className="text-[0.75rem] tracking-[0.08em] leading-[2] text-white/60 max-w-[500px]">
          Every package includes return flights, five-star accommodation and a dedicated host. Choose
          how deep you want to go.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-3 mt-12"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {PACKAGES.map((pkg) => (
          <PackageCard key={pkg.name} pkg={pkg} />
        ))}
      </motion.div>
    </section>
  )
}

function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <motion.div
      className="border rounded-[2px] overflow-hidden flex flex-col"
      style={{ borderColor: pkg.featured ? 'var(--pm-purple)' : 'var(--pm-glass-border)' }}
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Header */}
      <div
        className="px-6 py-8 text-center"
        style={{
          background: pkg.featured
            ? 'linear-gradient(135deg, var(--pm-navy), rgba(var(--pm-purple-rgb),0.3))'
            : 'var(--pm-navy)',
        }}
      >
        <div className="min-h-6 mb-3">
          {pkg.badge && (
            <span
              className="text-[0.55rem] tracking-[0.2em] uppercase px-3 py-1 rounded-[2px]"
              style={{ background: 'var(--pm-purple)', color: 'var(--pm-midnight)' }}
            >
              {pkg.badge}
            </span>
          )}
        </div>
        <p className="font-heading text-[1.8rem] font-normal text-white mb-2">{pkg.name}</p>
        <p className="font-heading text-[2.8rem] text-white leading-none">{pkg.price}</p>
        <p className="text-[0.65rem] tracking-[0.1em] text-white/50 mt-1">per person, from</p>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 py-6">
        <ul className="flex flex-col">
          {pkg.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-3 py-3 text-[0.7rem] tracking-[0.05em] leading-relaxed text-white/70 border-b last:border-b-0"
              style={{ borderColor: 'var(--pm-glass-border)' }}
            >
              <span
                className="size-[5px] rounded-full flex-shrink-0 mt-[6px]"
                style={{
                  background: pkg.dotAccent === 'gold' ? 'var(--pm-gold)' : 'var(--pm-purple)',
                }}
              />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="p-6 pt-0">
        <a
          href="#trips"
          className="block text-center text-[0.6rem] tracking-[0.2em] uppercase py-[0.9rem] border rounded-[2px] transition-colors"
          style={{
            background: pkg.featured ? 'var(--pm-purple)' : 'transparent',
            borderColor: pkg.featured ? 'var(--pm-purple)' : 'var(--pm-glass-border)',
            color: pkg.featured ? 'var(--pm-midnight)' : 'var(--pm-cream)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--pm-purple)'
            e.currentTarget.style.borderColor = 'var(--pm-purple)'
            e.currentTarget.style.color = 'var(--pm-midnight)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = pkg.featured ? 'var(--pm-purple)' : 'transparent'
            e.currentTarget.style.borderColor = pkg.featured
              ? 'var(--pm-purple)'
              : 'var(--pm-glass-border)'
            e.currentTarget.style.color = pkg.featured ? 'var(--pm-midnight)' : 'var(--pm-cream)'
          }}
        >
          Reserve — {pkg.name}
        </a>
      </div>
    </motion.div>
  )
}
