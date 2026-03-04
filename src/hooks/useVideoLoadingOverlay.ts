'use client'

import { useLayoutEffect } from 'react'

type VideoRef =
  | React.RefObject<HTMLVideoElement | null>
  | React.RefObject<HTMLVideoElement | null>[]

/**
 * Hides the loading overlay (nextElementSibling of the last video with .loading-overlay) when any
 * video can play through. Use with <video> element(s) that have a sibling <div className="loading-overlay" />.
 */
export function useVideoLoadingOverlay(
  videoRefOrRefs: VideoRef,
  isActive: boolean
): void {
  const refs = Array.isArray(videoRefOrRefs) ? videoRefOrRefs : [videoRefOrRefs]

  useLayoutEffect(() => {
    if (!isActive) return
    const videoEls = refs
      .map((r) => r.current)
      .filter((el): el is HTMLVideoElement => el != null)
    if (videoEls.length === 0) return

    const lastEl = videoEls[videoEls.length - 1]
    const loadingOverlay = lastEl.nextElementSibling

    const hideLoadingOverlay = () => {
      if (loadingOverlay && loadingOverlay instanceof HTMLElement) {
        loadingOverlay.classList.add('hidden')
      }
    }

    const bind = (el: HTMLVideoElement) => {
      el.addEventListener('canplaythrough', hideLoadingOverlay)
      if (el.readyState >= 3) hideLoadingOverlay()
      return () => el.removeEventListener('canplaythrough', hideLoadingOverlay)
    }

    const unbind = videoEls.map(bind)
    return () => unbind.forEach((fn) => fn())
  }, [isActive, refs])
}
