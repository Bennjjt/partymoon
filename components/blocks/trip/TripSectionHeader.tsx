import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

interface TripSectionHeaderProps {
  eyebrow: string
  headline: string
  /** Italic subordinate clause rendered inside the h2 at 0.75em in pale gold */
  sub?: string
  /** Italic paragraph rendered between h2 and divider — for spa-style subheadings */
  subheading?: string
  /** Short paragraph rendered below the divider */
  description?: React.ReactNode
  /**
   * Tailwind margin class applied to the divider bar.
   * Auto-resolved: 'mb-6' when description is present, 'mb-10' otherwise.
   * Pass explicitly to override.
   */
  dividerClass?: string
  className?: string
}

export function TripSectionHeader({
  eyebrow,
  headline,
  sub,
  subheading,
  description,
  dividerClass,
  className,
}: TripSectionHeaderProps) {
  const resolvedDividerClass = dividerClass ?? (description ? 'mb-6' : 'mb-10')

  return (
    <RevealOnScroll className={className}>
      <p className="text-[0.6rem] tracking-[0.5em] uppercase mb-4" style={{ color: 'var(--pm-accent)' }}>
        {eyebrow}
      </p>
      <h2
        className="font-heading font-light text-white mb-3"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.95, textWrap: 'balance' } as React.CSSProperties}
      >
        {headline}
        {sub && (
          <>
            <br />
            <em className="italic" style={{ color: 'var(--pm-purple-light)', fontSize: '0.75em' }}>
              {sub}
            </em>
          </>
        )}
      </h2>
      {subheading && (
        <p className="font-heading italic mb-3" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: 'var(--pm-purple-light)' }}>
          {subheading}
        </p>
      )}
      <div className={`w-16 h-[3px] ${resolvedDividerClass}`} style={{ background: 'linear-gradient(to right, var(--pm-gold-dim), var(--pm-purple))' }} />
      {description && (
        <p className="text-[0.9rem] leading-[1.9] font-light max-w-xl mb-10" style={{ color: 'rgba(232,232,240,0.65)' }}>
          {description}
        </p>
      )}
    </RevealOnScroll>
  )
}
