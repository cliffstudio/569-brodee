'use client'
/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'
import { useVideoLoadingOverlay } from '@/hooks/useVideoLoadingOverlay'
import type { SanityBunnyVideo, SanityImageArrayItem } from '@/types/sanity'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import { videoUrlFor, videoPosterFor } from '@/sanity/utils/videoUrlBuilder'
import { normalizeImageArrayItem } from '@/lib/sanityImage'
import ResponsiveSanityImage from '@/components/ResponsiveSanityImage'
import SplideCarousel from '@/components/SplideCarousel'

interface FullWidthMediaSectionProps {
  mediaType?: string | null
  images?: SanityImageArrayItem[] | null
  video?: SanityBunnyVideo | null
}

export default function FullWidthMediaSection({
  mediaType = 'image',
  images,
  video,
}: FullWidthMediaSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isVideo = mediaType === 'video' && video
  const list = images ?? []

  useVideoLoadingOverlay(videoRef, !!isVideo)

  if (isVideo) {
    return (
      <section className="full-width-media-section">
        <div className="fill-space-video-wrap">
          <video
            ref={videoRef}
            src={videoUrlFor(video)}
            poster={videoPosterFor(video)}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="loading-overlay" />
        </div>
      </section>
    )
  }

  if (list.length === 0) return null

  if (list.length === 1) {
    const { desktop, mobile } = normalizeImageArrayItem(list[0])
    return (
      <section className="full-width-media-section">
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
    <section className="full-width-media-section">
      <SplideCarousel images={carouselImages} />
    </section>
  )
}
