import localFont from 'next/font/local'
import React from 'react'
import './globals.css'

const montserrat = localFont({
  variable: '--font-sans',
  src: [
    { path: './fonts/montserrat-300.woff2', weight: '300', style: 'normal' },
    { path: './fonts/montserrat-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/montserrat-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/montserrat-600.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
})

const cormorant = localFont({
  variable: '--font-cormorant',
  src: [
    { path: './fonts/cormorant-300.woff2',        weight: '300', style: 'normal' },
    { path: './fonts/cormorant-400.woff2',        weight: '400', style: 'normal' },
    { path: './fonts/cormorant-500.woff2',        weight: '500', style: 'normal' },
    { path: './fonts/cormorant-600.woff2',        weight: '600', style: 'normal' },
    { path: './fonts/cormorant-300-italic.woff2', weight: '300', style: 'italic' },
    { path: './fonts/cormorant-400-italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/cormorant-500-italic.woff2', weight: '500', style: 'italic' },
    { path: './fonts/cormorant-600-italic.woff2', weight: '600', style: 'italic' },
  ],
  display: 'swap',
})

const geistMono = localFont({
  variable: '--font-geist-mono',
  src: [
    { path: './fonts/geist-mono-400.woff2', weight: '400', style: 'normal' },
  ],
  display: 'swap',
})

// Single root layout — renders the <html> and <body> singletons once.
// suppressHydrationWarning allows Payload's RootLayout to add data-theme,
// dir, and other attributes without causing hydration mismatches.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${cormorant.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
