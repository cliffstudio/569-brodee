'use client'
/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'
import { useVideoLoadingOverlay } from '@/hooks/useVideoLoadingOverlay'
import type { SanityImage, SanityVideo } from '@/types/sanity'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import { videoUrlFor, videoPosterFor } from '@/sanity/utils/videoUrlBuilder'

export interface DualMediaSectionProps {
  mediaType1?: string | null
  image1?: SanityImage | null
  video1?: SanityVideo | null
  mediaType2?: string | null
  image2?: SanityImage | null
  video2?: SanityVideo | null
  alignment?: 'left' | 'right'
}

function MediaBlock({
  mediaType,
  image,
  video,
  videoRef,
  slot,
}: {
  mediaType: string
  image?: SanityImage | null
  video?: SanityVideo | null
  videoRef: React.RefObject<HTMLVideoElement | null>
  slot: 1 | 2
}) {
  const hasImage = mediaType === 'image' && image
  const hasVideo = mediaType === 'video' && video

  if (!hasImage && !hasVideo) return null

  return (
    <div className={`media-${slot} ${slot === 1 ? 'col-3-12_lg' : 'col-5-12_lg'}`}>
      {hasImage && (
        <div className="media-wrap out-of-opacity">
          <img
            data-src={urlFor(image!).url()}
            alt=""
            className="lazy full-bleed-image"
          />
          <div className="loading-overlay" />
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
    </div>
  )
}

export default function DualMediaSection({
  mediaType1 = 'image',
  image1,
  video1,
  mediaType2 = 'image',
  image2,
  video2,
  alignment = 'left',
}: DualMediaSectionProps) {
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const has1 = (mediaType1 === 'image' && image1) || (mediaType1 === 'video' && video1)
  const has2 = (mediaType2 === 'image' && image2) || (mediaType2 === 'video' && video2)

  useVideoLoadingOverlay(video1Ref, mediaType1 === 'video' && !!video1)
  useVideoLoadingOverlay(video2Ref, mediaType2 === 'video' && !!video2)

  if (!has1 && !has2) return null

  const first = alignment === 'left' ? 1 : 2

  return (
    <section className="dual-media-section h-pad row-lg">
      {first === 1 ? (
        <>
          <MediaBlock
            slot={1}
            mediaType={mediaType1 ?? 'image'}
            image={image1}
            video={video1}
            videoRef={video1Ref}
          />
          <div className="col-3-12_lg dummy-col"></div>
          <MediaBlock
            slot={2}
            mediaType={mediaType2 ?? 'image'}
            image={image2}
            video={video2}
            videoRef={video2Ref}
          />
          <div className="col-1-12_lg dummy-col"></div>
        </>
      ) : (
        <>
          <MediaBlock
            slot={2}
            mediaType={mediaType2 ?? 'image'}
            image={image2}
            video={video2}
            videoRef={video2Ref}
          />
          <div className="col-3-12_lg dummy-col"></div>
          <MediaBlock
            slot={1}
            mediaType={mediaType1 ?? 'image'}
            image={image1}
            video={video1}
            videoRef={video1Ref}
          />
          <div className="col-1-12_lg dummy-col"></div>
        </>
      )}
    </section>
  )
}
