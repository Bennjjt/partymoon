export default function TripLoading() {
  return (
    <div style={{ background: 'var(--pm-deep)' }}>
      {/* Navbar placeholder */}
      <div className="h-16 border-b animate-pulse" style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }} />

      {/* Hero skeleton */}
      <div
        className="relative flex items-end min-h-[85vh] px-6 md:px-12 pb-16 animate-pulse"
        style={{ background: 'linear-gradient(160deg,#1a1535 0%,#0d1a35 50%,#0d0d28 100%)' }}
      >
        <div className="w-full max-w-2xl space-y-4">
          <div className="h-3 w-24 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-14 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-5 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex gap-3 pt-4">
            <div className="h-12 w-36 rounded-[2px]" style={{ background: 'rgba(var(--pm-purple-rgb),0.3)' }} />
            <div className="h-12 w-36 rounded-[2px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </div>
      </div>

      {/* Ticker placeholder */}
      <div className="border-y py-4 animate-pulse" style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}>
        <div className="flex gap-8 px-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 w-24 rounded" style={{ background: 'var(--pm-glass)' }} />
          ))}
        </div>
      </div>

      {/* Content blocks skeleton */}
      <div className="px-6 md:px-12 py-24 space-y-8 animate-pulse" style={{ background: 'var(--pm-deep)' }}>
        <div className="h-3 w-32 rounded" style={{ background: 'var(--pm-glass)' }} />
        <div className="h-8 w-64 rounded" style={{ background: 'var(--pm-glass)' }} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-[2px]" style={{ background: 'var(--pm-glass)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
