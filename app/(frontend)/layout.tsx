import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { VisualEditingClient } from '@/components/sanity/VisualEditingClient'

export const metadata: Metadata = {
  title: {
    default: "Partymoon — Europe's VIP Travel Experience",
    template: '%s | Partymoon',
  },
  description:
    "Six cities. Every weekend. Flights, five-star hotels, VIP tables and transfers — every detail curated. You simply show up and live it.",
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: preview } = await draftMode()
  return (
    <>
      {children}
      {preview && <VisualEditingClient />}
    </>
  )
}
