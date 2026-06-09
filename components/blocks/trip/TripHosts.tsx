import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { TripHost } from '@/lib/data/trips'

interface TripHostsProps {
  hosts: TripHost[]
}

export function TripHosts({ hosts }: TripHostsProps) {
  if (!hosts.length) return null

  return (
    <section
      style={{
        background: 'var(--pm-deep)',
        borderTop: '1px solid rgba(var(--pm-purple-rgb),0.15)',
        borderBottom: '1px solid rgba(var(--pm-purple-rgb),0.15)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="px-6 md:px-12 py-24">
        <RevealOnScroll>
          <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: 'var(--pm-accent)' }}>All Weekend, Both Nights</p>
          <h2 className="font-heading font-light text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.95 }}>
            YOUR HOSTS.<br />
            <em className="italic" style={{ color: 'var(--pm-purple-light)', fontSize: '0.75em' }}>the reason it works.</em>
          </h2>
          <div className="w-16 h-[3px] mb-6" style={{ background: 'linear-gradient(to right, var(--pm-gold-dim), var(--pm-purple))' }} />
          <p className="text-[0.9rem] leading-[1.9] font-light max-w-xl mb-10" style={{ color: 'rgba(232,232,240,0.6)' }}>
            Two dedicated specialists are with you from the airport to the farewell brunch — handling every detail so your only job is to enjoy every single moment.
          </p>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 gap-[1.5px]" style={{ background: 'rgba(var(--pm-purple-rgb),0.12)' }}>
          {hosts.map((host, i) => (
            <RevealOnScroll key={host.id ?? i} delay={i * 0.1}>
              <div className="p-10 relative overflow-hidden" style={{ background: 'var(--pm-deep)' }}>
                {/* Glow */}
                <div
                  className="absolute bottom-[-60px] right-[-60px] size-48 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(var(--pm-purple-rgb),0.12) 0%, transparent 70%)' }}
                />

                {host.icon && (
                  <span className="block text-4xl mb-6" style={{ filter: 'drop-shadow(0 0 10px rgba(var(--pm-purple-rgb),0.5))' }}>
                    {host.icon}
                  </span>
                )}
                {host.role && (
                  <p className="text-[0.6rem] tracking-[0.4em] uppercase font-medium mb-2" style={{ color: 'var(--pm-accent)' }}>
                    {host.role}
                  </p>
                )}
                {host.name && (
                  <p className="font-heading text-[1.5rem] text-white mb-4">{host.name}</p>
                )}
                {host.bio && (
                  <p className="text-[0.9rem] leading-[1.8] font-light" style={{ color: 'rgba(232,232,240,0.55)' }}>
                    {host.bio}
                  </p>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.2}>
          <div className="mt-8 p-10 text-center" style={{ background: 'rgba(var(--pm-purple-rgb),0.06)', border: '1px solid rgba(var(--pm-purple-rgb),0.15)' }}>
            <p className="font-heading italic text-[1.1rem] mb-3 mx-auto max-w-lg" style={{ color: 'rgba(232,232,240,0.7)', lineHeight: 1.8 }}>
              &ldquo;We don&rsquo;t just plan weekends. We host them, live them, and make sure every single person leaves having had the time of their life.&rdquo;
            </p>
            <span className="text-[0.6rem] tracking-[0.4em] uppercase font-medium" style={{ color: 'var(--pm-purple)' }}>
              — Partymoon
            </span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
