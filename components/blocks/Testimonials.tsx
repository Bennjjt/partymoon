import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

const REVIEWS = [
  {
    quote:
      "I've done Ibiza a dozen times. Nothing comes close to this. The table at Ushuaïa alone was worth every penny — but it was the fact that not a single thing went wrong that made it extraordinary.",
    author: 'James K.',
    trip: 'Ibiza, Premium package',
  },
  {
    quote:
      "Silk Soiree in Mykonos was the weekend I didn't know I needed. No planning, no group chat chaos, no decisions. Just twelve women who didn't want to think about a single thing. Absolute perfection.",
    author: 'Sarah M.',
    trip: 'Silk Soiree — Mykonos',
  },
  {
    quote:
      "We booked the Monaco weekend for our team — 20 people, all different tastes. Partymoon pulled it off flawlessly. The host was incredible and the Jimmy'z table was the stuff of legend in our office.",
    author: 'David R.',
    trip: 'Monaco, Corporate group',
  },
]

export function Testimonials() {
  return (
    <section className="px-6 md:px-12 py-24" style={{ background: 'var(--pm-deep)' }}>
      <RevealOnScroll className="text-center mb-12">
        <p
          className="text-[0.6rem] tracking-[0.35em] uppercase mb-3"
          style={{ color: 'var(--pm-purple-light)' }}
        >
          Experiences
        </p>
        <h2
          className="font-heading font-light leading-[1.2]"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', textWrap: 'balance' }}
        >
          What our guests <em className="italic">say</em>
        </h2>
        <div className="w-16 h-[3px] mt-5 mx-auto" style={{ background: 'linear-gradient(to right, var(--pm-gold-dim), var(--pm-gold))' }} />
      </RevealOnScroll>

      <div className="grid gap-6 md:grid-cols-3">
        {REVIEWS.map(({ quote, author, trip }, i) => (
          <RevealOnScroll key={author} delay={i * 0.1}>
            <div
              className="p-8 border rounded-[2px] h-full"
              style={{ borderColor: 'var(--pm-glass-border)' }}
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    className="size-[10px]"
                    style={{
                      background: 'var(--pm-gold)',
                      clipPath:
                        'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                    }}
                  />
                ))}
              </div>
              <blockquote className="font-heading text-[1rem] italic leading-[1.7] text-white mb-6">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <p
                className="text-[0.6rem] tracking-[0.2em] uppercase"
                style={{ color: 'var(--pm-purple-light)' }}
              >
                {author}
              </p>
              <p className="text-[0.6rem] tracking-[0.1em] text-white/40 mt-1">{trip}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
