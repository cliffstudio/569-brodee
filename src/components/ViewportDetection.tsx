'use client'

import { useEffect } from 'react'

// Track observed elements in memory only — never set data-in-viewport-observed on
// the DOM, so server HTML and client never differ and hydration cannot mismatch.
const observedElements = new WeakSet<Element>()

const HYDRATION_BUFFER_MS = 300

/**
 * Ensure work only runs after the initial window "load" event has fired.
 * On client-side navigations, "load" has already fired so we run immediately.
 */
function runAfterInitialLoad(fn: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  let cancelHydrationRun: (() => void) | null = null
  let loadHandler: (() => void) | null = null

  const schedule = () => {
    cancelHydrationRun = runAfterHydration(fn)
  }

  if (document.readyState === 'complete') {
    schedule()
  } else {
    loadHandler = () => {
      window.removeEventListener('load', loadHandler as () => void)
      schedule()
    }
    window.addEventListener('load', loadHandler)
  }

  return () => {
    if (loadHandler) {
      window.removeEventListener('load', loadHandler)
    }
    if (cancelHydrationRun) {
      cancelHydrationRun()
    }
  }
}

/**
 * Schedule work until after React hydration and paint so we don't mutate DOM
 * before/during hydration (which causes hydration mismatch).
 * Returns a cleanup function to cancel the scheduled run.
 */
function runAfterHydration(fn: () => void): () => void {
  let cancelled = false
  const run = () => {
    if (!cancelled) fn()
  }
  if (typeof requestAnimationFrame === 'undefined') {
    const t = setTimeout(run, HYDRATION_BUFFER_MS)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }
  let raf1 = 0
  let raf2 = 0
  let t: ReturnType<typeof setTimeout> | number = 0
  raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(() => {
      t = setTimeout(run, HYDRATION_BUFFER_MS)
    })
  })
  return () => {
    cancelled = true
    cancelAnimationFrame(raf1)
    cancelAnimationFrame(raf2)
    clearTimeout(t)
  }
}

/**
 * Viewport detection for .out-of-view, .out-of-opacity, and .off-screen. Runs only after
 * hydration and paint so server HTML and client match and we don't mutate
 * React-owned nodes during hydration.
 */
export default function ViewportDetection() {
  useEffect(() => {
    const selector = '.out-of-view, .out-of-opacity'
    const MAX_STAGE = 10
    let mutationObserver: MutationObserver | null = null

    /**
     * Get this element's index among siblings that are also staggerable (same selector).
     * Used to assign stage-1, stage-2, ... for automatic stagger by DOM order.
     */
    function getStaggerIndex(el: Element): number {
      const parent = el.parentElement
      if (!parent) return 0
      const siblings = Array.from(parent.children).filter((child) =>
        child.matches(selector)
      )
      const index = siblings.indexOf(el)
      return index >= 0 ? index : 0
    }

    function runOutOfView() {
      const elements = document.querySelectorAll(selector)
      elements.forEach((el) => {
        if (observedElements.has(el)) return
        observedElements.add(el)

        const stageIndex = getStaggerIndex(el)
        const stage = Math.min(stageIndex + 1, MAX_STAGE)
        // Defer adding stage class to next frame so we never mutate during
        // React commit or right after navigation (avoids insertBefore conflict).
        requestAnimationFrame(() => {
          if (!document.contains(el)) return
          ;(el as HTMLElement).classList.add(`stage-${stage}`)
        })

        const observer = new IntersectionObserver(
          (entries) => {
            // Defer DOM mutation to the next frame so we never mutate during
            // the same tick as hydration or the observer callback.
            requestAnimationFrame(() => {
              entries.forEach((entry) => {
                const target = entry.target as HTMLElement
                if (entry.isIntersecting) {
                  target.classList.add('am-in-view', 'in-view-detect')
                  if (target.classList.contains('out-of-opacity')) {
                    target.classList.add('in-opacity')
                  }
                  if (target.classList.contains('off-screen')) {
                    target.classList.add('on-screen')
                  }
                } else {
                  target.classList.remove('in-view-detect')
                  if (target.classList.contains('off-screen')) {
                    target.classList.remove('on-screen')
                  }
                }
              })
            })
          },
          { rootMargin: '0px', threshold: 0 }
        )
        observer.observe(el)
      })
    }

    // Defer until after the initial page load, hydration and first paint so we
    // don't add classes to server-rendered nodes before React has finished
    // hydrating them.
    const cancelInitial = runAfterInitialLoad(runOutOfView)

    mutationObserver = new MutationObserver((mutations) => {
      let shouldReRun = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const el = node as Element
              if (
                el.classList?.contains('out-of-view') ||
                el.classList?.contains('out-of-opacity') ||
                el.classList?.contains('off-screen')
              )
                shouldReRun = true
              if (
                el.querySelector?.(
                  '.out-of-view, .out-of-opacity, .off-screen'
                )
              )
                shouldReRun = true
            }
          })
        }
      })
      if (shouldReRun) {
        // For client-side navigations hydration is already done, so we can
        // schedule directly after paint without waiting for window "load".
        // This avoids mutating during React commit or ScrollSmoother effects
        // on route change (avoids insertBefore error).
        runAfterHydration(runOutOfView)
      }
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    const popHandler = () => runAfterHydration(runOutOfView)
    window.addEventListener('popstate', popHandler)

    return () => {
      cancelInitial()
      mutationObserver?.disconnect()
      window.removeEventListener('popstate', popHandler)
    }
  }, [])

  return null
}
