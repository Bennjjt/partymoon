'use client'

import { useBooking } from '@/components/providers/BookingProvider'
import { motion } from 'framer-motion'

const FEATURES = [
  'Intimate groups of 12 women maximum — never a tour, always an experience',
  'Every detail handled before you even pack your bag — nothing to think about',
  'Welcome gifts, room touches, thoughtful moments throughout the entire weekend',
  'The founder attends every Silk Soiree weekend, personally',
]

const CITIES = [
  {
    name: 'Mykonos',
    price: '£4,500 pp',
    desc: 'Suite hotel · Scorpios at golden hour · Private yacht day · Nammos dining · 12 women · Everything arranged',
  },
  {
    name: 'Cannes',
    price: '£5,200 pp',
    desc: 'Riviera villa · Private chef dinner · Baoli VIP table · Beach club · 12 women · Nothing to organise',
  },
  {
    name: 'Amalfi Coast',
    price: '£6,500 pp',
    desc: 'Clifftop villa buyout · Private boat · Anema e Core · Personal concierge · 12 women · Pure indulgence',
  },
  {
    name: 'Monaco',
    price: '£5,800 pp',
    desc: "Hôtel de Paris · Casino Royale experience · Jimmy'z VIP · Grand Prix glamour · 12 women · Unforgettable",
  },
]

export function SilkSoiree() {
  const { open } = useBooking()

  return (
    <section
      className="px-6 md:px-12 py-24 border-y"
      style={{
        background: 'var(--pm-silk-bg)',
        borderColor: 'var(--pm-silk-border)',
      }}
      id="silk"
    >
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p
            className="text-[0.6rem] tracking-[0.35em] uppercase mb-3"
            style={{ color: 'var(--pm-silk-red)' }}
          >
            A Partymoon experience
          </p>
          <h2
            className="font-heading font-light italic leading-[1.2] mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--pm-silk-red)', textWrap: 'balance' }}
          >
            Silk Soiree
          </h2>
          <p
            className="text-[0.75rem] tracking-[0.08em] leading-[2] max-w-[500px]"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Exclusively for professional women. You spend your working life organising everything for
            everyone else. This weekend, let us handle every single detail — you simply arrive and enjoy
            every moment you&apos;ve earned.
          </p>

          <ul className="flex flex-col gap-4 mt-8">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex gap-4 items-start px-4 py-4 border rounded-[2px]"
                style={{ borderColor: 'var(--pm-silk-card-border)' }}
              >
                <span
                  className="size-[5px] rounded-full flex-shrink-0 mt-[6px]"
                  style={{ background: 'var(--pm-silk-red)' }}
                />
                <span
                  className="text-[0.7rem] tracking-[0.05em] leading-[1.8]"
                  style={{ color: 'rgba(255,255,255,0.60)' }}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={() =>
              open({ destination: 'Silk Soiree', date: 'your chosen date', basePrice: '£4,500' })
            }
            className="inline-flex mt-10 text-[0.65rem] tracking-[0.2em] uppercase font-bold px-10 py-4 border rounded-[2px] transition-all"
            style={{ color: 'var(--pm-silk-red)', borderColor: 'var(--pm-silk-red-dim)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--pm-silk-btn-hover-bg)'
              e.currentTarget.style.borderColor = 'var(--pm-silk-red)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--pm-silk-red-dim)'
            }}
          >
            Discover Silk Soiree
          </button>
        </motion.div>

        {/* Right — city cards */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          {CITIES.map(({ name, price, desc }) => (
            <div
              key={name}
              className="px-6 py-5 border rounded-[2px] transition-all cursor-pointer"
              style={{ borderColor: 'var(--pm-silk-card-border)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--pm-silk-card-border-hover)'
                e.currentTarget.style.background = 'var(--pm-silk-card-hover-bg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--pm-silk-card-border)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-heading text-[1.3rem] font-light"
                  style={{ color: 'var(--pm-silk-red)' }}
                >
                  {name}
                </span>
                <span className="font-heading text-[1.5rem] text-white">{price}</span>
              </div>
              <p
                className="text-[0.65rem] tracking-[0.08em] leading-[1.8]"
                style={{ color: 'rgba(255,255,255,0.60)' }}
              >
                {desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
