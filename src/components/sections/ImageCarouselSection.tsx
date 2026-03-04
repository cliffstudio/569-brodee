'use client'
/* eslint-disable @next/next/no-img-element */
import type { SanityImageArrayItem } from '@/types/sanity'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import { normalizeImageArrayItem } from '@/lib/sanityImage'
import ResponsiveSanityImage from '@/components/ResponsiveSanityImage'
import SplideCarousel from '@/components/SplideCarousel'

interface ImageCarouselSectionProps {
  images?: SanityImageArrayItem[] | null
}

export default function ImageCarouselSection({ images }: ImageCarouselSectionProps) {
  const list = images ?? []

  if (list.length === 0) return null

  if (list.length === 1) {
    const { desktop, mobile } = normalizeImageArrayItem(list[0])
    return (
      <section className="image-carousel-section">
        <div className="fill-space-image-wrap">
          <ResponsiveSanityImage
            desktop={desktop}
            mobile={mobile}
            className="lazy full-bleed-image"
          />
          <div className="loading-overlay" />
        </div>
      </section>
    )
  }

  const carouselImages = list.map((item) => {
    const { desktop, mobile } = normalizeImageArrayItem(item)
    const desktopUrl = urlFor(desktop).url()
    const mobileUrl = urlFor(mobile).url()
    return {
      url: desktopUrl,
      mobileUrl: desktopUrl !== mobileUrl ? mobileUrl : undefined,
      alt: '',
    }
  })

  return (
    <section className="image-carousel-section">
      <SplideCarousel images={carouselImages} autoplay={false} />
    </section>
  )
}
