'use client'
/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'
import { useVideoLoadingOverlay } from '@/hooks/useVideoLoadingOverlay'
import type { SanityBunnyVideo, SanityImage } from '@/types/sanity'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import { videoUrlFor, videoPosterFor } from '@/sanity/utils/videoUrlBuilder'
import SplideCarousel from '@/components/SplideCarousel'

interface FullWidthMediaSectionProps {
  mediaType?: string | null
  images?: SanityImage[] | null
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

  return (
    <section className="full-width-media-section">
      {list.length === 1 ? (
        <div className="fill-space-image-wrap">
          <img
            data-src={urlFor(list[0]).url()}
            alt=""
            className="lazy full-bleed-image"
          />
          <div className="loading-overlay" />
        </div>
      ) : (
        <SplideCarousel
          images={list.map((image) => ({ url: urlFor(image).url(), alt: '' }))}
        />
      )}
    </section>
  )
}
