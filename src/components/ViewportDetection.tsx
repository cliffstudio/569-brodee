'use client'

import { useEffect } from 'react'

export default function ViewportDetection() {
  useEffect(() => {
    let scheduledTimeout: number | undefined

    const scheduleFadeIn = (delayMs = 200) => {
      if (typeof window === 'undefined') return
      if (scheduledTimeout !== undefined) {
        window.clearTimeout(scheduledTimeout)
      }
      scheduledTimeout = window.setTimeout(fadeIn, delayMs)
    }

    const fadeIn = () => {
      const animatedTags = document.querySelectorAll(
        '.out-of-view, .out-of-opacity'
      )

      // Start slightly after load
      let delay = 0.2

      animatedTags.forEach((tag) => {
        const el = tag as HTMLElement
        const rect = el.getBoundingClientRect()
        const tagTop = rect.top
        const tagBottom = rect.bottom

        if (tagTop < window.innerHeight && tagBottom > 0) {
          const isOutOfView = el.classList.contains('out-of-view')
          const animationName = isOutOfView ? 'fadeInUp' : 'fadeIn'
          el.style.animation = `${animationName} 1500ms cubic-bezier(0.19, 1, 0.22, 1) ${delay}s both`
          // Delay between items
          delay += 0.2
        }
      })
    }

    // Initial run (after GSAP / route content has rendered)
    scheduleFadeIn(200)

    window.addEventListener('scroll', fadeIn)
    window.addEventListener('resize', fadeIn)

    // When the DOM changes (e.g. client-side route change adding new sections),
    // re-run the fade logic for newly added out-of-view/out-of-opacity elements.
    const observer =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver((mutations) => {
            let shouldSchedule = false
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                  if (node.nodeType !== 1) return
                  const el = node as Element
                  if (
                    el.matches?.('.out-of-view, .out-of-opacity') ||
                    el.querySelector?.('.out-of-view, .out-of-opacity')
                  ) {
                    shouldSchedule = true
                  }
                })
              }
            })
            if (shouldSchedule) {
              scheduleFadeIn(50)
            }
          })
        : null

    observer?.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (scheduledTimeout !== undefined) {
        window.clearTimeout(scheduledTimeout)
      }
      window.removeEventListener('scroll', fadeIn)
      window.removeEventListener('resize', fadeIn)
      observer?.disconnect()
    }
  }, [])

  return null
}
