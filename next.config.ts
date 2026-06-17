import type { NextConfig } from 'next'

// Derive the site hostname from NEXT_PUBLIC_SITE_URL so next/image can
// optimise local media uploads served from the same origin.
// Remove this pattern once all media is migrated to Sanity CDN.
function siteRemotePattern() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  try {
    const url = new URL(raw)
    return {
      protocol: (url.protocol.startsWith('https') ? 'https' : 'http') as 'http' | 'https',
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: '/media/**',
    }
  } catch {
    return { protocol: 'http' as const, hostname: 'localhost', pathname: '/media/**' }
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      siteRemotePattern(),
      // Sanity CDN — serves all uploaded media assets
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default nextConfig
