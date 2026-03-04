'use client'

import { useMemo, useRef } from 'react'
import type { SanityVideo } from '@/types/sanity'
import { videoUrlFor, videoPosterFor } from '@/sanity/utils/videoUrlBuilder'
import { useVideoLoadingOverlay } from '@/hooks/useVideoLoadingOverlay'

interface ResponsiveVideoProps {
  desktop: SanityVideo
  mobile?: SanityVideo | null
  className?: string
}

/** Resolve desktop and mobile video (defaults to desktop when mobile not set). */
function getDesktopMobileVideo(
  desktop: SanityVideo,
  mobile?: SanityVideo | null
): { desktop: SanityVideo; mobile: SanityVideo } {
  return { desktop, mobile: mobile ?? desktop }
}

export default function ResponsiveVideo({
  desktop,
  mobile,
  className = '',
}: ResponsiveVideoProps) {
  const desktopRef = useRef<HTMLVideoElement>(null)
  const mobileRef = useRef<HTMLVideoElement>(null)
  const videoRefs = useMemo(() => [desktopRef, mobileRef], [])
  const { desktop: d, mobile: m } = getDesktopMobileVideo(desktop, mobile)

  useVideoLoadingOverlay(videoRefs, !!desktop)

  if (!desktop) return null

  const cn = (suffix: string) => `${className} ${suffix}`.trim()

  return (
    <>
      <video
        ref={desktopRef}
        src={videoUrlFor(d)}
        poster={videoPosterFor(d)}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={cn('desktop')}
      />
      <video
        ref={mobileRef}
        src={videoUrlFor(m)}
        poster={videoPosterFor(m)}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={cn('mobile')}
      />
      <div className="loading-overlay" />
    </>
  )
}
