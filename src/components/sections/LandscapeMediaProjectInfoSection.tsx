'use client'
/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import { useVideoLoadingOverlay } from '@/hooks/useVideoLoadingOverlay'
import type { SanityImage, SanityBunnyVideo } from '@/types/sanity'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import { videoUrlFor, videoPosterFor } from '@/sanity/utils/videoUrlBuilder'
import {
  resolveInternationalized,
  resolveInternationalizedPortableText,
  type InternationalizedPortableText,
  type InternationalizedValue,
} from '@/lib/locale'

export type ProjectInfoItem = {
  _key?: string
  title?: InternationalizedValue | null
  copy?: InternationalizedPortableText | null
}

export interface LandscapeMediaProjectInfoSectionProps {
  mediaType?: string | null
  image?: SanityImage | null
  video?: SanityBunnyVideo | null
  projectInfo?: ProjectInfoItem[] | null
  locale: string
}

export default function LandscapeMediaProjectInfoSection({
  mediaType,
  image,
  video,
  projectInfo,
  locale,
}: LandscapeMediaProjectInfoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasImage = mediaType === 'image' && image
  const hasVideo = mediaType === 'video' && video
  const hasMedia = hasImage || hasVideo
  const hasProjectInfo = Array.isArray(projectInfo) && projectInfo.length > 0

  useVideoLoadingOverlay(videoRef, !!hasVideo)

  if (!hasMedia && !hasProjectInfo) return null

  const mediaBlock = hasMedia && (
    <div className="content-wrap col-8-12_lg">
      {hasImage && (
        <div className="media-wrap out-of-opacity stage-1">
          <img
            data-src={urlFor(image!).url()}
            alt=""
            className="lazy full-bleed-image"
          />
          <div className="loading-overlay" />
        </div>
      )}
      {hasVideo && (
        <div className="media-wrap out-of-opacity stage-1">
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
    </div>
  )

  const projectInfoBlock = hasProjectInfo && (
    <div className="col-4-12_lg project-info out-of-view stage-2">
      {projectInfo.map((item, index) => {
        const resolvedTitle = resolveInternationalized(item.title ?? undefined, locale)
        const resolvedCopy = resolveInternationalizedPortableText(item.copy ?? undefined, locale)
        if (!resolvedTitle && !resolvedCopy) return null
        return (
          <div key={item._key ?? index}>
            {resolvedTitle && <div className="heading uppercase bold">{resolvedTitle}</div>}
            {resolvedCopy && (
              <div className="copy uppercase">
                <PortableText value={resolvedCopy as any} components={portableTextComponents} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <section className="landscape-media-project-info-section h-pad row-lg">
      {mediaBlock}
      {projectInfoBlock}
    </section>
  )
}
