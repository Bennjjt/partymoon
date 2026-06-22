import Link from 'next/link'
import { getPublishedTrips } from '@/lib/queries/trips'
import type { TripsResult } from '@/lib/queries/trips'

const EXPERIENCE = [
  { label: 'How it works', href: '/#about' },
  { label: 'Packages', href: '/#packages' },
  { label: 'Silk Soirée', href: '/#silk' },
  { label: 'Join the waitlist', href: '/#waitlist' },
]

const COMPANY = [
  { label: 'Contact us', href: '/#waitlist' },
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'Cookie policy', href: '/cookie-policy' },
  { label: 'Terms & conditions', href: '#' },
]

const SOCIALS = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn']

export async function Footer() {
  const result: TripsResult = await getPublishedTrips()
  const trips = result.status === 'ok' ? result.trips : []

  return (
    <footer
      className="border-t px-6 md:px-12 pt-16 pb-8"
      style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <MoonIcon />
            <span className="font-heading text-2xl font-normal tracking-[0.15em] text-pm-moon">
              Partymoon
            </span>
          </div>
          <p className="text-[0.7rem] tracking-[0.05em] leading-[2] text-white/60 max-w-[260px]">
            Europe&apos;s most curated VIP travel experience. Six cities, every weekend, 40 weeks a year.
            Nothing to organise — everything to enjoy.
          </p>
        </div>

        {/* Destinations — CMS-driven */}
        <div>
          <p
            className="text-[0.6rem] tracking-[0.25em] uppercase mb-6"
            style={{ color: 'var(--pm-purple-light)' }}
          >
            Destinations
          </p>
          <ul className="flex flex-col gap-3">
            {trips.map((trip) => (
              <li key={trip.slug}>
                <Link
                  href={`/${trip.slug}`}
                  className="text-[0.7rem] tracking-[0.08em] text-white/60 hover:text-white transition-colors"
                >
                  {trip.destination}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience */}
        <div>
          <p
            className="text-[0.6rem] tracking-[0.25em] uppercase mb-6"
            style={{ color: 'var(--pm-purple-light)' }}
          >
            Experience
          </p>
          <ul className="flex flex-col gap-3">
            {EXPERIENCE.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-[0.7rem] tracking-[0.08em] text-white/60 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p
            className="text-[0.6rem] tracking-[0.25em] uppercase mb-6"
            style={{ color: 'var(--pm-purple-light)' }}
          >
            Company
          </p>
          <ul className="flex flex-col gap-3">
            {COMPANY.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-[0.7rem] tracking-[0.08em] text-white/60 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
        style={{ borderColor: 'var(--pm-glass-border)' }}
      >
        <p className="text-[0.6rem] tracking-[0.1em] text-white/40">
          © {new Date().getFullYear()} Partymoon Ltd. All rights reserved. ATOL protected.
        </p>
        <ul className="flex items-center gap-6">
          {SOCIALS.map((s) => (
            <li key={s}>
              <a
                href="#"
                className="text-[0.6rem] tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors"
              >
                {s}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

function MoonIcon() {
  return (
    <div
      className="relative size-7 rounded-full overflow-hidden flex-shrink-0"
      style={{ background: 'var(--pm-moon)' }}
    >
      <div
        className="absolute size-[22px] rounded-full"
        style={{ background: 'var(--pm-deep)', top: '3px', left: '9px' }}
      />
    </div>
  )
}
