'use client'

import { useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

export const SMOOTHER_WRAPPER_ID = 'smooth-wrapper'
export const SMOOTHER_CONTENT_ID = 'smooth-content'
const BODY_CLASS = 'smooth-scroll-active'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export default function ScrollSmootherProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const smootherRef = useRef<ScrollSmoother | null>(null)

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const wrapper = document.getElementById(SMOOTHER_WRAPPER_ID)
    const content = document.getElementById(SMOOTHER_CONTENT_ID)
    if (!wrapper || !content) return

    // Prefer reusing a compatible instance to avoid DOM teardown races.
    const existing = ScrollSmoother.get()
    let smoother: ScrollSmoother | null = null

    if (existing) {
      const existingWrapper = existing.wrapper()
      const existingContent = existing.content()

      if (existingWrapper === wrapper && existingContent === content) {
        smoother = existing
      } else {
        try {
          existing.kill()
        } catch {
          // Ignore kill race during fast route transitions.
        }
      }
    }

    try {
      if (!smoother) {
        smoother = ScrollSmoother.create({
          wrapper: `#${SMOOTHER_WRAPPER_ID}`,
          content: `#${SMOOTHER_CONTENT_ID}`,
          smooth: 1.2,
          effects: true,
        })
      }
      smootherRef.current = smoother
      document.body.classList.add(BODY_CLASS)
      document.documentElement.classList.add(BODY_CLASS)
    } catch {
      // Fallback: if smoother init fails, allow normal scrolling.
      smootherRef.current = null
      document.body.classList.remove(BODY_CLASS)
      document.documentElement.classList.remove(BODY_CLASS)
    }

    return () => {
      try {
        smoother?.kill()
      } catch {
        // Ignore teardown races where GSAP already removed nodes.
      }
      smootherRef.current = null
      document.body.classList.remove(BODY_CLASS)
      document.documentElement.classList.remove(BODY_CLASS)
    }
  }, [])

  // Route changes replace `children`; ensure ScrollTrigger recalculates.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    const smoother = smootherRef.current ?? ScrollSmoother.get()
    if (!smoother) return
    try {
      smoother.effects('[data-speed], [data-lag]')
      ScrollTrigger.refresh()
    } catch {
      // If a navigation teardown is in progress, skip this refresh cycle.
    }
  }, [pathname])

  return (
    <div id={SMOOTHER_WRAPPER_ID}>
      <div id={SMOOTHER_CONTENT_ID}>{children}</div>
    </div>
  )
}
