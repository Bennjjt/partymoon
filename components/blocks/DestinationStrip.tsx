'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export interface DestinationOption {
  label: string
  value: string  // matches Trip.slug; empty string = "all"
  season: string | null
  svgPath?: string | null
  svgViewBox?: string | null
}

interface Props {
  destinations: DestinationOption[]
}

// base-ui Select doesn't accept empty string as a controlled value, so we
// use a sentinel for the "All cities" option and map it on the way in/out.
const ALL_VALUE = '__all__'

function toSelectValue(dest: string) {
  return dest === '' ? ALL_VALUE : dest
}

function fromSelectValue(val: string) {
  return val === ALL_VALUE ? '' : val
}

export function DestinationStrip({ destinations }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeDest = searchParams.get('dest') ?? ''

  const handleSelect = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('dest', value)
      } else {
        params.delete('dest')
      }
      const query = params.toString()
      router.push(query ? `?${query}` : '/', { scroll: false })
    },
    [router, searchParams],
  )

  const allOption: DestinationOption = { label: 'All cities', value: '', season: null }
  const options = [allOption, ...destinations]

  return (
    <div
      className="border-y px-6 md:px-12 py-5 md:py-8"
      style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}
    >
      {/* ── Mobile: Select dropdown ──────────────────────────── */}
      <div className="md:hidden">
        <Select
          value={toSelectValue(activeDest)}
          onValueChange={(val) => handleSelect(fromSelectValue(val ?? ALL_VALUE))}
        >
          <SelectTrigger
            className="w-full rounded-[2px] border text-[0.65rem] tracking-[0.2em] uppercase text-white"
            style={{
              background: 'var(--pm-navy)',
              borderColor: 'var(--pm-glass-border)',
              height: '2.75rem',
            }}
          >
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ label, value }) => (
              <SelectItem
                key={value || ALL_VALUE}
                value={toSelectValue(value)}
                className="text-[0.65rem] tracking-[0.15em] uppercase cursor-pointer"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Desktop: pill row spread across full container width ── */}
      <motion.div
        className="hidden md:flex justify-between"
        role="list"
        aria-label="Filter by destination"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {options.map(({ label, value, season, svgPath, svgViewBox }) => (
          <DestPill
            key={value || 'all'}
            label={label}
            value={value}
            season={season}
            svgPath={svgPath}
            svgViewBox={svgViewBox}
            active={activeDest === value}
            onSelect={handleSelect}
          />
        ))}
      </motion.div>
    </div>
  )
}

function DestPill({
  label,
  value,
  season,
  svgPath,
  svgViewBox,
  active,
  onSelect,
}: {
  label: string
  value: string
  season: string | null
  svgPath?: string | null
  svgViewBox?: string | null
  active: boolean
  onSelect: (value: string) => void
}) {
  return (
    <motion.button
      role="listitem"
      onClick={() => onSelect(value)}
      className="flex items-center gap-3 px-4 py-[0.55rem] border rounded-[2px] cursor-pointer whitespace-nowrap"
      style={{
        borderColor: active ? 'var(--pm-purple)' : 'var(--pm-glass-border)',
        background: active ? 'rgba(var(--pm-purple-rgb),0.1)' : 'transparent',
      }}
      whileHover={
        active
          ? { borderColor: 'var(--pm-purple)', background: 'rgba(var(--pm-purple-rgb),0.18)' }
          : { borderColor: 'rgba(155,143,237,0.6)', background: 'rgba(var(--pm-purple-rgb),0.07)' }
      }
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {svgPath && svgViewBox ? (
        <svg
          viewBox={svgViewBox}
          aria-hidden="true"
          className="flex-shrink-0"
          style={{ width: 22, height: 22 }}
        >
          <path
            d={svgPath}
            fill={active ? 'rgba(201,168,76,0.55)' : 'rgba(201,168,76,0.28)'}
            stroke={active ? '#c9a84c' : 'rgba(201,168,76,0.5)'}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <div
          className="size-[5px] rounded-full flex-shrink-0"
          style={{ background: active ? 'var(--pm-purple)' : 'var(--pm-purple-light)' }}
        />
      )}
      {season ? (
        <>
          <span className="text-[0.6rem] tracking-[0.1em] font-medium text-white">{label}</span>
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-white/40">{season}</span>
        </>
      ) : (
        <span className="text-[0.6rem] tracking-[0.2em] uppercase text-white">{label}</span>
      )}
    </motion.button>
  )
}
