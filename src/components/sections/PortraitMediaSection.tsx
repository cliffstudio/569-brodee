'use client'
/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'
import { useVideoLoadingOverlay } from '@/hooks/useVideoLoadingOverlay'
import type { SanityImage, SanityVideo } from '@/types/sanity'
import ResponsiveSanityImage from '@/components/ResponsiveSanityImage'
import { videoUrlFor, videoPosterFor } from '@/sanity/utils/videoUrlBuilder'
import { resolveInternationalized } from '@/lib/locale'

const CAPTION_CLASS: Record<string, string> = {
  media1: 'caption',
  media2: 'page-home-media2-caption',
  media3: 'page-home-media3-caption',
}

export interface PortraitMediaSectionProps {
  mediaType?: string | null
  image?: SanityImage | null
  imageMobile?: SanityImage | null
  video?: SanityVideo | null
  caption?: { _key: string; value?: string }[] | null
  alignment?: 'left' | 'right'
  locale: string
  layoutVariant?: 'media1' | 'media2' | 'media3'
}

export default function PortraitMediaSection({
  mediaType,
  image,
  imageMobile,
  video,
  caption,
  alignment = 'left',
  locale,
  layoutVariant,
}: PortraitMediaSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const resolvedCaption = resolveInternationalized(caption ?? undefined, locale)
  const hasImage = mediaType === 'image' && image
  const hasVideo = mediaType === 'video' && video

  useVideoLoadingOverlay(videoRef, !!hasVideo)

  if (!hasImage && !hasVideo) return null

  const alignmentClass = alignment === 'right' ? 'align-right' : 'align-left'
  const captionClass = CAPTION_CLASS[layoutVariant ?? 'media1'] ?? 'caption'

  const mediaBlock = (
    <div className="content-wrap col-5-12_lg">
      {hasImage && (
        <div className="media-wrap out-of-opacity">
          <ResponsiveSanityImage
            desktop={image!}
            mobile={imageMobile}
            className="lazy full-bleed-image"
          />
        </div>
      )}

      {hasVideo && (
        <div className="media-wrap out-of-opacity">
          <div className="fill-space-video-wrap">
            <video
              ref={videoRef}
              src={videoUrlFor(video!)}
              poster={videoPosterFor(video)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="loading-overlay" />
          </div>
        </div>
      )}

      {resolvedCaption && <div className={captionClass + ' out-of-view'}>{resolvedCaption}</div>}
    </div>
  )

  return (
    <section className={`portrait-media-section ${alignmentClass} h-pad row-lg`}>
      {alignment === 'right' ? (
        <>
          <div className="col-7-12_lg dummy-col"></div>
          {mediaBlock}
        </>
      ) : (
        <>
          {mediaBlock}
          <div className="col-7-12_lg dummy-col"></div>
        </>
      )}
    </section>
  )
}
