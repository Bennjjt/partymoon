export default function HomeLoading() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--pm-midnight)' }}>
      {/* Navbar placeholder */}
      <div className="h-16 border-b animate-pulse" style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }} />

      {/* Hero placeholder */}
      <div
        className="relative flex items-end min-h-[90vh] px-6 md:px-12 pb-20 animate-pulse"
        style={{ background: 'linear-gradient(160deg,#1a1535 0%,#0d1a35 50%,#0d0d28 100%)' }}
      >
        <div className="w-full max-w-3xl space-y-5">
          <div className="h-3 w-28 rounded" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <div className="h-16 w-2/3 rounded" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <div className="h-4 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="flex gap-3 pt-2">
            <div className="h-12 w-40 rounded-[2px]" style={{ background: 'rgba(var(--pm-purple-rgb),0.25)' }} />
            <div className="h-12 w-40 rounded-[2px]" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </div>
      </div>

      {/* Destination strip placeholder */}
      <div className="border-y px-6 md:px-12 py-8 animate-pulse" style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}>
        <div className="flex gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-9 rounded-[2px]" style={{ width: i === 0 ? 96 : 80, background: 'var(--pm-glass)' }} />
          ))}
        </div>
      </div>

      {/* Trips section placeholder */}
      <div className="px-6 md:px-12 py-24 animate-pulse" style={{ background: 'var(--pm-midnight)' }}>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="h-2 w-36 rounded" style={{ background: 'var(--pm-glass)' }} />
            <div className="h-10 w-64 rounded" style={{ background: 'var(--pm-glass)' }} />
          </div>
          <div className="h-3 w-48 rounded" style={{ background: 'var(--pm-glass)' }} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-[2px] overflow-hidden"
              style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}
            >
              <div className="h-[220px]" style={{ background: 'var(--pm-glass)' }} />
              <div className="p-6 space-y-4">
                <div className="h-3 w-40 rounded" style={{ background: 'var(--pm-glass)' }} />
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="space-y-1">
                      <div className="h-2 w-10 rounded" style={{ background: 'var(--pm-glass)' }} />
                      <div className="h-3 w-20 rounded" style={{ background: 'var(--pm-glass)' }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-4 border-t" style={{ borderColor: 'var(--pm-glass-border)' }}>
                  <div className="h-6 w-20 rounded" style={{ background: 'var(--pm-glass)' }} />
                  <div className="h-4 w-16 rounded" style={{ background: 'var(--pm-glass)' }} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-9 rounded-[2px]" style={{ background: 'var(--pm-glass)' }} />
                  <div className="flex-1 h-9 rounded-[2px]" style={{ background: 'var(--pm-glass)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
