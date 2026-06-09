import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { TripClub } from '@/lib/data/trips'

interface TripClubsProps {
  clubs: TripClub[]
}

export function TripClubs({ clubs }: TripClubsProps) {
  if (!clubs.length) return null

  return (
    <section
      style={{
        background: 'radial-gradient(ellipse at center top, rgba(var(--pm-purple-rgb),0.1) 0%, transparent 60%), var(--pm-midnight)',
        borderTop: '1px solid rgba(var(--pm-purple-rgb),0.2)',
        borderBottom: '1px solid rgba(var(--pm-purple-rgb),0.2)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="px-6 md:px-12 py-24">
        <RevealOnScroll>
          <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: 'var(--pm-accent)' }}>Two Nights Out</p>
          <h2 className="font-heading font-light text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.95 }}>
            THE CLUBS.<br />
            <em className="italic" style={{ color: 'var(--pm-purple-light)', fontSize: '0.75em' }}>the finest.</em>
          </h2>
          <div className="w-16 h-[3px] mb-6" style={{ background: 'linear-gradient(to right, var(--pm-gold-dim), var(--pm-purple))' }} />
          <p className="text-[0.9rem] leading-[1.9] font-light max-w-xl mb-10" style={{ color: 'rgba(232,232,240,0.6)' }}>
            Your two VIP nights are curated for the group's energy and confirmed in advance. Entry guaranteed, tables booked.
          </p>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 gap-[1.5px]" style={{ background: 'rgba(var(--pm-purple-rgb),0.12)' }}>
          {clubs.map((club, i) => (
            <RevealOnScroll key={club.id ?? i} delay={i * 0.08}>
              <div
                className="p-10 relative overflow-hidden transition-colors duration-300 group"
                style={{ background: 'var(--pm-deep)' }}
              >
                <span
                  className="absolute bottom-4 right-6 font-heading text-[4rem] leading-none pointer-events-none select-none"
                  style={{ color: 'rgba(var(--pm-purple-rgb),0.08)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {club.badge && (
                  <span
                    className="inline-block text-[0.55rem] font-medium tracking-[0.35em] uppercase px-3 py-1 rounded-full mb-4"
                    style={{ background: 'rgba(var(--pm-accent-rgb),0.15)', color: 'rgba(var(--pm-purple-rgb),0.9)', border: '1px solid rgba(var(--pm-accent-rgb),0.3)' }}
                  >
                    {club.badge}
                  </span>
                )}

                <p className="font-heading text-[1.6rem] leading-tight text-white mb-1">{club.name}</p>

                {club.vibe && (
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: 'rgba(var(--pm-purple-rgb),0.6)' }}>
                    {club.vibe}
                  </p>
                )}

                {club.description && (
                  <p className="text-[0.9rem] leading-[1.75] font-light" style={{ color: 'rgba(232,232,240,0.5)' }}>
                    {club.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-5 text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'var(--pm-purple)' }}>
                  <span className="size-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--pm-purple)', boxShadow: '0 0 6px var(--pm-purple)' }} />
                  VIP Entry · Table Service · Bottle Package
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div
            className="mt-6 px-6 py-5"
            style={{ border: '1px solid rgba(var(--pm-purple-rgb),0.15)', background: 'rgba(var(--pm-purple-rgb),0.05)' }}
          >
            <p className="text-[0.9rem] italic font-light leading-[1.7]" style={{ color: 'rgba(232,232,240,0.4)' }}>
              Venues are confirmed closer to your travel date — chosen based on what the city is hosting that weekend, the group's vibe, and your hosts' relationships with the most exclusive doors in town.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
