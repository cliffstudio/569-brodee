'use client'
/* eslint-disable @next/next/no-img-element */
import type { SanityImage } from '@/types/sanity'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import SplideCarousel from '@/components/SplideCarousel'

interface ImageCarouselSectionProps {
  images?: SanityImage[] | null
}

export default function ImageCarouselSection({ images }: ImageCarouselSectionProps) {
  const list = images ?? []

  if (list.length === 0) return null

  if (list.length === 1) {
    return (
      <section className="image-carousel-section">
        <div className="fill-space-image-wrap">
          <img
            data-src={urlFor(list[0]).url()}
            alt=""
            className="lazy full-bleed-image"
          />
          <div className="loading-overlay" />
        </div>
      </section>
    )
  }

  return (
    <section className="image-carousel-section">
      <SplideCarousel
        images={list.map((image) => ({ url: urlFor(image).url(), alt: '' }))}
        autoplay={false}
      />
    </section>
  )
}
