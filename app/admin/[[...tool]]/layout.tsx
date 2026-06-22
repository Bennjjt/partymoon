import type { Metadata, Viewport } from 'next'

export const dynamic = 'force-dynamic'

// Mirrors next-sanity/studio's metadata/viewport without importing that
// module here — its index also statically imports the client-only Studio
// bundle, which trips Next's server-side static analysis during builds.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  referrer: 'same-origin',
  robots: 'noindex',
}

const fullHeightStyle: React.CSSProperties = {
  height: '100vh',
  maxHeight: '100dvh',
  overscrollBehavior: 'none',
  WebkitFontSmoothing: 'antialiased',
  overflow: 'auto',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="sanity" data-ui="NextStudioLayout" style={fullHeightStyle}>
      {children}
    </div>
  )
}
