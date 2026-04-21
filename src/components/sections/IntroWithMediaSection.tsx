'use client'

import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import type { SanityImage, SanityVideo } from '@/types/sanity'
import type { InternationalizedPortableText, InternationalizedValue } from '@/lib/locale'
import { resolveInternationalized, resolveInternationalizedPortableText } from '@/lib/locale'
import ResponsiveSanityImage from '@/components/ResponsiveSanityImage'
import { videoUrlFor, videoPosterFor } from '@/sanity/utils/videoUrlBuilder'
import Link from 'next/link'
import { useRef } from 'react'
import { useVideoLoadingOverlay } from '@/hooks/useVideoLoadingOverlay'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'

export type IntroWithMediaCta = {
  _type?: 'internal' | 'external' | 'fileUpload'
  label?: string | null
  labelI18n?: InternationalizedValue | null
  slug?: string | null
  url?: string | null
  fileUrl?: string | null
}

export interface IntroWithMediaSectionProps {
  mediaType?: 'image' | 'video' | null
  title?: InternationalizedValue | null
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
  title,
  image,
  imageMobile,
  video,
  copy,
  cta,
  alignment = 'left',
  locale,
}: IntroWithMediaSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const resolvedTitle = resolveInternationalized(title ?? undefined, locale)
  const resolvedCopy = resolveInternationalizedPortableText(copy ?? undefined, locale)
  const hasImage = mediaType === 'image' && image
  const hasVideo = mediaType === 'video' && video
  const hasMedia = hasImage || hasVideo

  useVideoLoadingOverlay(videoRef, !!hasVideo)

  const ctaHref =
    (cta?.slug != null ? `/${cta.slug}` : null) ?? cta?.url ?? cta?.fileUrl ?? null
  const ctaLabel = resolveInternationalized(cta?.labelI18n ?? undefined, locale) ?? cta?.label ?? null

  const hasContent = hasMedia || resolvedTitle || resolvedCopy || ctaLabel
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
    <div className="text-wrap col-4-12_lg out-of-view">
      {resolvedTitle && <h3 className="heading uppercase">{resolvedTitle}</h3>}
      {resolvedCopy && (
        <div className="text">
          <PortableText value={resolvedCopy as any} components={portableTextComponents} />
        </div>
      )}
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="cta-link script-font">
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
          <div className="col-1-12_lg dummy-col"></div>
          {copyBlock}
          <div className="col-3-12_lg dummy-col"></div>
          {mediaBlock}
        </>
      ) : (
        <>
          {mediaBlock}
          <div className="col-3-12_lg dummy-col"></div>
          {copyBlock}
          <div className="col-1-12_lg dummy-col"></div>
        </>
      )}
    </section>
  )
}
