'use client'
/* eslint-disable @next/next/no-img-element */
import type { SanityImageArrayItem, SanityVideo } from '@/types/sanity'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import { normalizeImageArrayItem } from '@/lib/sanityImage'
import ResponsiveSanityImage from '@/components/ResponsiveSanityImage'
import ResponsiveVideo from '@/components/ResponsiveVideo'
import SplideCarousel from '@/components/SplideCarousel'

interface FullWidthMediaSectionProps {
  mediaType?: string | null
  images?: SanityImageArrayItem[] | null
  video?: SanityVideo | null
  videoMobile?: SanityVideo | null
}

export default function FullWidthMediaSection({
  mediaType = 'image',
  images,
  video,
  videoMobile,
}: FullWidthMediaSectionProps) {
  const isVideo = mediaType === 'video' && video
  const list = images ?? []

  if (isVideo) {
    return (
      <section className="full-width-media-section">
        <div className="fill-space-video-wrap out-of-opacity">
          <ResponsiveVideo
            desktop={video}
            mobile={videoMobile}
            className="fill-space-video"
          />
        </div>
      </section>
    )
  }

  if (list.length === 0) return null

  if (list.length === 1) {
    const { desktop, mobile } = normalizeImageArrayItem(list[0])
    return (
      <section className="full-width-media-section">
        <div className="fill-space-image-wrap out-of-opacity">
          <ResponsiveSanityImage
            desktop={desktop}
            mobile={mobile}
            className="lazy full-bleed-image"
          />
        </div>
      </section>
    )
  }

  const carouselImages = list.map((item) => {
    const { desktop, mobile } = normalizeImageArrayItem(item)
    const desktopUrl = urlFor(desktop).url()
    const mobileUrl = urlFor(mobile).url()
    return {
      desktopUrl,
      mobileUrl: desktopUrl !== mobileUrl ? mobileUrl : undefined,
      alt: '',
    }
  })

  return (
    <section className="full-width-media-section">
      <SplideCarousel images={carouselImages} />
    </section>
  )
}
