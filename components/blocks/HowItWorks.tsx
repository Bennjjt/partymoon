import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

const STEPS = [
  {
    num: '01',
    title: 'Choose your weekend',
    desc: 'Browse the full calendar. Pick your destination, your date, your package. Reserve with a £300 deposit.',
  },
  {
    num: '02',
    title: 'We handle everything',
    desc: 'Flights, five-star hotel, VIP table reservations, transfers, dining — your complete itinerary arrives two weeks before departure.',
  },
  {
    num: '03',
    title: 'Just show up',
    desc: 'Your Partymoon host meets you at the airport. From this moment, not a single thing to worry about.',
  },
  {
    num: '04',
    title: 'Live the weekend',
    desc: "VIP tables, five-star stays, Europe's most iconic clubs. This is exactly what you worked for.",
  },
]

export function HowItWorks() {
  return (
    <section
      className="px-6 md:px-12 py-24 text-center"
      style={{ background: 'var(--pm-midnight)' }}
      id="about"
    >
      <RevealOnScroll>
        <p
          className="text-[0.6rem] tracking-[0.35em] uppercase mb-3"
          style={{ color: 'var(--pm-purple-light)' }}
        >
          The Partymoon promise
        </p>
        <h2
          className="font-heading font-light leading-[1.2]"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          How it <em className="italic">works</em>
        </h2>
      </RevealOnScroll>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-16">
        {STEPS.map(({ num, title, desc }, i) => (
          <RevealOnScroll key={num} delay={i * 0.1} className="text-center">
            <p
              className="font-heading text-[4rem] font-light leading-none mb-4"
              style={{ color: 'rgba(var(--pm-purple-rgb),0.3)' }}
            >
              {num}
            </p>
            <h3 className="font-heading text-[1.2rem] text-white mb-3">{title}</h3>
            <p className="text-[0.7rem] tracking-[0.05em] leading-[2] text-white/50">{desc}</p>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
