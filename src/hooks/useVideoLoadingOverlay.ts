'use client'

import { useLayoutEffect } from 'react'

/**
 * Hides the loading overlay (nextElementSibling with .loading-overlay) when the
 * video can play through. Use with a <video> that has a sibling <div className="loading-overlay" />.
 */
export function useVideoLoadingOverlay(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isActive: boolean
): void {
  useLayoutEffect(() => {
    if (!isActive || !videoRef.current) return
    const videoEl = videoRef.current

    const hideLoadingOverlay = () => {
      const loadingOverlay = videoEl.nextElementSibling
      if (loadingOverlay && loadingOverlay instanceof HTMLElement) {
        loadingOverlay.classList.add('hidden')
      }
    }

    videoEl.addEventListener('canplaythrough', hideLoadingOverlay)
    if (videoEl.readyState >= 3) {
      hideLoadingOverlay()
    }

    return () => {
      videoEl.removeEventListener('canplaythrough', hideLoadingOverlay)
    }
  }, [isActive])
}
