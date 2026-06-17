'use client'

import Link from 'next/link'
import type { Trip } from '@/lib/data/trips'
import { motion } from 'framer-motion'
import { TripCard } from './TripCard'

export function TripGrid({ trips }: { trips: Trip[] }) {
  if (trips.length === 0) return <NoResults />

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {trips.map((trip, i) => (
        <motion.div
          key={trip.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.07, ease: 'easeOut' }}
        >
          <TripCard trip={trip} />
        </motion.div>
      ))}
    </div>
  )
}

function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-heading text-[2rem] font-light mb-3" style={{ color: 'var(--pm-purple-light)' }}>
        No trips found
      </p>
      <p className="text-[0.75rem] tracking-[0.08em] text-white/40 mb-8">
        No weekends are currently scheduled for that destination.
      </p>
      <Link
        href="/"
        className="text-[0.65rem] tracking-[0.2em] uppercase px-8 py-3 border text-white rounded-[2px] transition-colors hover:border-white/40"
        style={{ borderColor: 'var(--pm-glass-border)' }}
      >
        View all trips
      </Link>
    </div>
  )
}
