'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

export const SMOOTHER_WRAPPER_ID = 'smooth-wrapper'
export const SMOOTHER_CONTENT_ID = 'smooth-content'
const BODY_CLASS = 'smooth-scroll-active'
const SMOOTH_SCROLL_MEDIA = '(min-width: 769px)'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export default function ScrollSmootherProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const smootherRef = useRef<ScrollSmoother | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!window.matchMedia(SMOOTH_SCROLL_MEDIA).matches) {
      document.documentElement.classList.add('scroll-enabled')
      return () => {
        document.documentElement.classList.remove('scroll-enabled')
      }
    }

    const wrapper = document.getElementById(SMOOTHER_WRAPPER_ID)
    const content = document.getElementById(SMOOTHER_CONTENT_ID)
    if (!wrapper || !content) return

    const smoother = ScrollSmoother.create({
      wrapper: `#${SMOOTHER_WRAPPER_ID}`,
      content: `#${SMOOTHER_CONTENT_ID}`,
      smooth: 1,
      effects: true,
    })
    smootherRef.current = smoother
    document.body.classList.add(BODY_CLASS)
    document.documentElement.classList.add(BODY_CLASS, 'scroll-enabled')

    function onAnchorClick(e: MouseEvent) {
      const a = (e.target as Element).closest?.('a[href*="#"]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const hash = href.split('#')[1]
      if (!hash) return
      const target = document.getElementById(hash)
      if (target) {
        e.preventDefault()
        smoother.scrollTo(target, true, 'top top')
        window.history.pushState(null, '', href)
      }
    }
    document.addEventListener('click', onAnchorClick)

    const timeoutId = setTimeout(() => {
      smoother.effects('[data-speed], [data-lag]')
      ScrollTrigger.refresh()
      if (window.location.hash) {
        const el = document.querySelector(window.location.hash)
        if (el) smoother.scrollTo(el, true, 'top top')
      } else {
        smoother.scrollTo(0, false)
      }
    }, 150)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', onAnchorClick)
      smoother.kill()
      smootherRef.current = null
      document.body.classList.remove(BODY_CLASS)
      document.documentElement.classList.remove(BODY_CLASS)
    }
  }, [pathname])

  return (
    <div id={SMOOTHER_WRAPPER_ID}>
      <div id={SMOOTHER_CONTENT_ID}>{children}</div>
    </div>
  )
}
