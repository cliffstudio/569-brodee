'use client'

/* eslint-disable @next/next/no-img-element */
import type { SanityImage } from '@/types/sanity'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import {
  resolveInternationalized,
  type InternationalizedValue,
} from '@/lib/locale'

interface LogoCarouselSectionProps {
  title?: InternationalizedValue | null
  images?: SanityImage[] | null
  locale: string
}

function LogoItem({ image }: { image: SanityImage }) {
  return (
    <div className="logo-carousel__item">
      <img
        data-src={urlFor(image).url()}
        alt=""
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
          {[...list, ...list].map((image, index) => (
            <LogoItem key={index} image={image} />
          ))}
        </div>
      </div>
    </section>
  )
}
