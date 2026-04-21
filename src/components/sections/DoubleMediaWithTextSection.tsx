'use client'
/* eslint-disable @next/next/no-img-element */
import { PortableText } from '@portabletext/react'
import { useRef } from 'react'
import type { InternationalizedPortableText, InternationalizedValue } from '@/lib/locale'
import { resolveInternationalized, resolveInternationalizedPortableText } from '@/lib/locale'
import { portableTextComponents } from '@/components/PortableTextComponents'
import type { SanityImage, SanityVideo } from '@/types/sanity'
import ResponsiveSanityImage from '@/components/ResponsiveSanityImage'
import { videoPosterFor, videoUrlFor } from '@/sanity/utils/videoUrlBuilder'
import { useVideoLoadingOverlay } from '@/hooks/useVideoLoadingOverlay'
import type { IntroWithMediaCta } from './IntroWithMediaSection'
import Link from 'next/link'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'

export interface DoubleMediaWithTextSectionProps {
  mediaType1?: string | null
  image1?: SanityImage | null
  image1Mobile?: SanityImage | null
  video1?: SanityVideo | null
  title1?: InternationalizedValue | null
  copy1?: InternationalizedPortableText | null
  cta1?: IntroWithMediaCta | null
  mediaType2?: string | null
  image2?: SanityImage | null
  image2Mobile?: SanityImage | null
  video2?: SanityVideo | null
  title2?: InternationalizedValue | null
  copy2?: InternationalizedPortableText | null
  cta2?: IntroWithMediaCta | null
  locale: string
}

function MediaWithCopy({
  mediaType,
  image,
  imageMobile,
  video,
  title,
  copy,
  cta,
  locale,
  videoRef,
  slot,
}: {
  mediaType: string
  image?: SanityImage | null
  imageMobile?: SanityImage | null
  video?: SanityVideo | null
  title?: InternationalizedValue | null
  copy?: InternationalizedPortableText | null
  cta?: IntroWithMediaCta | null
  locale: string
  videoRef: React.RefObject<HTMLVideoElement | null>
  slot: 1 | 2
}) {
  const hasImage = mediaType === 'image' && image
  const hasVideo = mediaType === 'video' && video
  const resolvedTitle = resolveInternationalized(title ?? undefined, locale)
  const resolvedCopy = resolveInternationalizedPortableText(copy ?? undefined, locale)
  const ctaHref =
    (cta?.slug != null ? `/${cta.slug}` : null) ?? cta?.url ?? cta?.fileUrl ?? null
  const ctaLabel = resolveInternationalized(cta?.labelI18n ?? undefined, locale) ?? cta?.label ?? null
  const hasContent = hasImage || hasVideo || resolvedTitle || resolvedCopy || ctaLabel
  if (!hasContent) return null

  return (
    <div className={`media-${slot} ${slot === 1 ? 'col-4-12_lg' : 'col-5-12_lg'}`}>
      {(hasImage || hasVideo) && (
        <div className="media-wrap out-of-opacity">
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
      )}
      {(resolvedTitle || resolvedCopy || (ctaLabel && ctaHref)) && (
        <div className="text-wrap out-of-view">
          {resolvedTitle && <h3 className="heading uppercase">{resolvedTitle}</h3>}
          <div className="text">
            {resolvedCopy && (
              <PortableText value={resolvedCopy as any} components={portableTextComponents} />
            )}
          </div>
          {ctaLabel && ctaHref && (
            <Link href={ctaHref} className="cta-link script-font">
              {ctaLabel}
              <ArrowRightIcon />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function DoubleMediaWithTextSection({
  mediaType1 = 'image',
  image1,
  image1Mobile,
  video1,
  title1,
  copy1,
  cta1,
  mediaType2 = 'image',
  image2,
  image2Mobile,
  video2,
  title2,
  copy2,
  cta2,
  locale,
}: DoubleMediaWithTextSectionProps) {
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  useVideoLoadingOverlay(video1Ref, mediaType1 === 'video' && !!video1)
  useVideoLoadingOverlay(video2Ref, mediaType2 === 'video' && !!video2)

  const hasFirst =
    (mediaType1 === 'image' && image1) ||
    (mediaType1 === 'video' && video1) ||
    resolveInternationalized(title1 ?? undefined, locale) ||
    resolveInternationalizedPortableText(copy1 ?? undefined, locale)
  const hasSecond =
    (mediaType2 === 'image' && image2) ||
    (mediaType2 === 'video' && video2) ||
    resolveInternationalized(title2 ?? undefined, locale) ||
    resolveInternationalizedPortableText(copy2 ?? undefined, locale)

  if (!hasFirst && !hasSecond) return null

  return (
    <section className="double-media-with-text-section h-pad row-lg">
      <MediaWithCopy
        slot={1}
        mediaType={mediaType1 ?? 'image'}
        image={image1}
        imageMobile={image1Mobile}
        video={video1}
        title={title1}
        copy={copy1}
        cta={cta1}
        locale={locale}
        videoRef={video1Ref}
      />
      <div className="col-3-12_lg dummy-col"></div>
      <MediaWithCopy
        slot={2}
        mediaType={mediaType2 ?? 'image'}
        image={image2}
        imageMobile={image2Mobile}
        video={video2}
        title={title2}
        copy={copy2}
        cta={cta2}
        locale={locale}
        videoRef={video2Ref}
      />
    </section>
  )
}
