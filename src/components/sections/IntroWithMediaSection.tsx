'use client'

import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import type { SanityImage, SanityVideo } from '@/types/sanity'
import type { InternationalizedPortableText } from '@/lib/locale'
import { resolveInternationalizedPortableText } from '@/lib/locale'
import ResponsiveSanityImage from '@/components/ResponsiveSanityImage'
import { videoUrlFor, videoPosterFor } from '@/sanity/utils/videoUrlBuilder'
import Link from 'next/link'
import { useRef } from 'react'
import { useVideoLoadingOverlay } from '@/hooks/useVideoLoadingOverlay'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'

export type IntroWithMediaCta = {
  _type?: 'internal' | 'external' | 'fileUpload'
  label?: string | null
  slug?: string | null
  url?: string | null
  fileUrl?: string | null
}

export interface IntroWithMediaSectionProps {
  mediaType?: 'image' | 'video' | null
  image?: SanityImage | null
  imageMobile?: SanityImage | null
  video?: SanityVideo | null
  copy?: InternationalizedPortableText | null
  cta?: IntroWithMediaCta | null
  alignment?: 'left' | 'right' | null
  locale: string
}

export default function IntroWithMediaSection({
  mediaType = 'image',
  image,
  imageMobile,
  video,
  copy,
  cta,
  alignment = 'left',
  locale,
}: IntroWithMediaSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const resolvedCopy = resolveInternationalizedPortableText(copy ?? undefined, locale)
  const hasImage = mediaType === 'image' && image
  const hasVideo = mediaType === 'video' && video
  const hasMedia = hasImage || hasVideo

  useVideoLoadingOverlay(videoRef, !!hasVideo)

  const ctaHref =
    (cta?.slug != null ? `/${cta.slug}` : null) ?? cta?.url ?? cta?.fileUrl ?? null
  const ctaLabel = cta?.label ?? null

  const hasContent = hasMedia || resolvedCopy || ctaLabel
  if (!hasContent) return null

  const alignmentClass = alignment === 'right' ? 'align-right' : 'align-left'

  const mediaBlock = hasMedia ? (
    <div className="media-wrap out-of-opacity col-4-12_lg">
      {hasImage && (
        <ResponsiveSanityImage
          desktop={image!}
          mobile={imageMobile}
          className="lazy full-bleed-image"
        />
      )}
      {hasVideo && (
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
      )}
    </div>
  ) : null

  const copyBlock = (
    <div className="intro-with-media-copy text-wrap col-6-12_lg out-of-view">
      {resolvedCopy && (
        <div className="text">
          <PortableText value={resolvedCopy as any} components={portableTextComponents} />
        </div>
      )}
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="cta-link">
          {ctaLabel}
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  )

  return (
    <section className={`intro-with-media-section ${alignmentClass} h-pad row-lg`}>
      {alignment === 'right' ? (
        <>
          {copyBlock}
          <div className="col-2-12_lg dummy-col"></div>
          {mediaBlock}
        </>
      ) : (
        <>
          {mediaBlock}
          <div className="col-2-12_lg dummy-col"></div>
          {copyBlock}
        </>
      )}
    </section>
  )
}
