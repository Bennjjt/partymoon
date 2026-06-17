import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: "Partymoon — Europe's VIP Travel Experience",
    template: '%s | Partymoon',
  },
  description:
    "Six cities. Every weekend. Flights, five-star hotels, VIP tables and transfers — every detail curated. You simply show up and live it.",
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
