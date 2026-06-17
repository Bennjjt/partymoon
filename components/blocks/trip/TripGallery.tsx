import Image from 'next/image'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { GalleryVideo } from '@/components/ui/GalleryVideo'
import type { CoverImage } from '@/lib/data/trips'

type GalleryItem = {
  id?: string
  image: CoverImage | null
  videoUrl?: string | null
  caption?: string | null
}

interface TripGalleryProps {
  destination: string
  gallery: GalleryItem[]
  gradient: string
}

export function TripGallery({ destination, gallery, gradient }: TripGalleryProps) {
  if (!gallery.length) return null

  return (
    <section
      className="border-t px-6 md:px-12 py-16"
      style={{ background: 'var(--pm-deep)', borderColor: 'var(--pm-glass-border)' }}
    >
      <RevealOnScroll>
        <p className="text-[0.6rem] tracking-[0.35em] uppercase mb-3" style={{ color: 'var(--pm-purple-light)' }}>
          Photography
        </p>
        <h2
          className="font-heading text-[1.8rem] font-light text-white mb-10"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          {destination} in pictures
        </h2>
      </RevealOnScroll>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {gallery.map((item, i) => (
          <RevealOnScroll key={item.id ?? i} delay={i * 0.06}>
            <div className="group">
              <div className="relative overflow-hidden rounded-[2px] bg-pm-deep" style={{ aspectRatio: '3 / 2' }}>
                {item.videoUrl ? (
                  <GalleryVideo
                    src={item.videoUrl}
                    gradient={gradient}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || `${destination} — Partymoon`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : null}
              </div>
              {item.caption && (
                <p className="text-[0.65rem] tracking-[0.05em] text-white/50 mt-2">{item.caption}</p>
              )}
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
