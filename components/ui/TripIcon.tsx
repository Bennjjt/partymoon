import {
  Plane,
  BedDouble,
  Bus,
  Music,
  Ship,
  Sailboat,
  Utensils,
  Users,
  ShieldCheck,
  Bike,
  Landmark,
  Waves,
  MapPin,
  Diamond,
  Sparkle,
  Hotel,
  Frame,
  Umbrella,
  type LucideProps,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Plane,
  BedDouble,
  Hotel,
  Bus,
  Music,
  Ship,
  Sailboat,
  Utensils,
  Users,
  ShieldCheck,
  Bike,
  Landmark,
  Waves,
  MapPin,
  Diamond,
  Sparkle,
  Frame,
  Umbrella,
}

interface TripIconProps extends LucideProps {
  name: string
}

export function TripIcon({ name, size = 24, ...props }: TripIconProps) {
  const Icon = ICON_MAP[name]
  if (!Icon) return null
  return <Icon size={size} {...props} />
}
