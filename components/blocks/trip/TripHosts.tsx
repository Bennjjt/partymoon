import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { TripSectionHeader } from '@/components/blocks/trip/TripSectionHeader'
import { TripIcon } from '@/components/ui/TripIcon'
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
        <TripSectionHeader
          eyebrow="All Weekend, Both Nights"
          headline="YOUR HOSTS."
          sub="the reason it works."
          description="Two dedicated specialists are with you from the airport to the farewell brunch — handling every detail so your only job is to enjoy every single moment."
        />

        <div className="grid sm:grid-cols-2 gap-[1.5px]" style={{ background: 'rgba(var(--pm-purple-rgb),0.12)' }}>
          {hosts.map((host, i) => (
            <RevealOnScroll key={host.id ?? i} delay={i * 0.1} className="h-full">
              <div className="h-full p-10 relative overflow-hidden" style={{ background: 'var(--pm-deep)' }}>
                {/* Ambient glow */}
                <div
                  className="absolute bottom-[-60px] right-[-60px] size-48 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(var(--pm-purple-rgb),0.12) 0%, transparent 70%)' }}
                />

                {host.icon && (
                  <div className="mb-6" style={{ color: 'var(--pm-purple)', filter: 'drop-shadow(0 0 10px rgba(var(--pm-purple-rgb),0.5))' }}>
                    <TripIcon name={host.icon} size={32} strokeWidth={1.25} />
                  </div>
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
                  <p className="text-[0.9rem] leading-[1.8] font-light" style={{ color: 'rgba(232,232,240,0.65)' }}>
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
