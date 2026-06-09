import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

// Derive the site hostname from NEXT_PUBLIC_SITE_URL so next/image can
// optimise Payload media uploads served from the same origin.
// In production, update this env var to your deployed domain; if you later
// switch to an S3 / CDN storage adapter, add that hostname here too.
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
  // Required for Next.js to compile Payload's SCSS source files from node_modules.
  // Without this, @payloadcms/ui's `import './index.scss'` side-effects are silently
  // skipped and the entire Payload admin design system is absent.
  transpilePackages: ['@payloadcms/ui', '@payloadcms/richtext-lexical', '@payloadcms/next'],
  images: {
    remotePatterns: [siteRemotePattern()],
  },
}

export default withPayload(nextConfig)
