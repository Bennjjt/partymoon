'use client'

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// CartoDB Dark Matter — no API key required
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

// Partymoon crescent-moon pin —
// Purple teardrop with the PM crescent (light circle + dark bite)
const PIN_SVG = `
<svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="pm-pin-shadow" x="-20%" y="-10%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>
  <!-- Teardrop body -->
  <path
    d="M20 1C9.5 1 1 9.5 1 20C1 32.5 20 51 20 51C20 51 39 32.5 39 20C39 9.5 30.5 1 20 1Z"
    fill="#6B5FCC"
    filter="url(#pm-pin-shadow)"
  />
  <!-- Subtle inner highlight ring -->
  <path
    d="M20 3C10.6 3 3 10.6 3 20C3 31.8 20 49 20 49C20 49 37 31.8 37 20C37 10.6 29.4 3 20 3Z"
    fill="none" stroke="rgba(221,208,255,0.25)" stroke-width="1"
  />
  <!-- Full moon (light) -->
  <circle cx="17" cy="20" r="9.5" fill="#ddd0ff"/>
  <!-- Bite (same colour as pin) to carve the crescent -->
  <circle cx="23" cy="16" r="7.5" fill="#6B5FCC"/>
</svg>
`

const pinIcon = L.divIcon({
  html: PIN_SVG,
  className: '',
  iconSize: [40, 52],
  iconAnchor: [20, 51],   // bottom-centre of the teardrop
  popupAnchor: [0, -52],
})

interface TripMapProps {
  latitude: number
  longitude: number
  destination: string
}

export default function TripMap({ latitude, longitude, destination }: TripMapProps) {
  return (
    <div className="relative w-full" style={{ height: '420px' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        aria-label={`Map showing the location of ${destination}`}
      >
        <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />
        <Marker position={[latitude, longitude]} icon={pinIcon} />
      </MapContainer>

      {/* Top fade — blends into the section above */}
      <div
        className="absolute top-0 left-0 right-0 h-12 pointer-events-none z-[1000]"
        style={{ background: 'linear-gradient(to bottom, var(--pm-midnight), transparent)' }}
      />
      {/* Bottom fade — blends into the section below */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-[1000]"
        style={{ background: 'linear-gradient(to top, var(--pm-midnight), transparent)' }}
      />
    </div>
  )
}
