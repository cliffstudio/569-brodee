'use client'

/* eslint-disable @next/next/no-img-element */
import type { SanityImageArrayItem } from '@/types/sanity'
import { normalizeImageArrayItem } from '@/lib/sanityImage'
import ResponsiveSanityImage from '@/components/ResponsiveSanityImage'
import {
  resolveInternationalized,
  type InternationalizedValue,
} from '@/lib/locale'

interface LogoCarouselSectionProps {
  title?: InternationalizedValue | null
  images?: SanityImageArrayItem[] | null
  locale: string
}

function LogoItem({ item }: { item: SanityImageArrayItem }) {
  const { desktop, mobile } = normalizeImageArrayItem(item)
  return (
    <div className="logo-carousel__item">
      <ResponsiveSanityImage
        desktop={desktop}
        mobile={mobile}
        className="lazy logo-carousel__img"
      />
    </div>
  )
}

export default function LogoCarouselSection({
  title,
  images,
  locale,
}: LogoCarouselSectionProps) {
  const list = images ?? []
  const resolvedTitle = resolveInternationalized(title ?? undefined, locale)

  if (list.length === 0 && !resolvedTitle) return null

  return (
    <section className="logo-carousel-section">
      {resolvedTitle && (
        <div className="heading uppercase h-pad out-of-view">
          {resolvedTitle}
        </div>
      )}

      <div className="logo-carousel out-of-opacity">
        <div className="logo-carousel__track" aria-hidden="true">
          {[...list, ...list].map((item, index) => (
            <LogoItem key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
