'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
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
  const isFirstPathnameRun = useRef(true)

  useEffect(() => {
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

    // Effects are registered with refresh: false, so run a refresh once layout has
    // settled so data-speed / data-lag ScrollTriggers get correct start/end and animate on scroll.
    const refreshId = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)
    document.documentElement.classList.add(BODY_CLASS, 'scroll-enabled')

    // Initial hash on load
    if (window.location.hash) {
      const t = setTimeout(() => {
        const el = document.querySelector(window.location.hash)
        if (el) smoother.scrollTo(el, true, 'top top')
      }, 150)
      return () => {
        clearTimeout(t)
        clearTimeout(refreshId)
        smoother.kill()
        smootherRef.current = null
        document.body.classList.remove(BODY_CLASS)
        document.documentElement.classList.remove(BODY_CLASS)
      }
    }

    return () => {
      clearTimeout(refreshId)
      smoother.kill()
      smootherRef.current = null
      document.body.classList.remove(BODY_CLASS)
      document.documentElement.classList.remove(BODY_CLASS)
    }
  }, [])

  // On route change: scroll to top before paint (useLayoutEffect) and again after layout
  useLayoutEffect(() => {
    if (isFirstPathnameRun.current) {
      isFirstPathnameRun.current = false
      return
    }
    const smoother = ScrollSmoother.get()
    if (smoother) smoother.scrollTo(0, false)
    const wrapper = document.getElementById(SMOOTHER_WRAPPER_ID)
    if (wrapper && 'scrollTop' in wrapper) wrapper.scrollTop = 0
  }, [pathname])

  // On route change: re-apply effects, refresh, then ensure we stay at top (or scroll to hash)
  useEffect(() => {
    const smoother = smootherRef.current
    if (!smoother) return

    if (!isFirstPathnameRun.current) {
      smoother.scrollTo(0, false)
    }

    const t = setTimeout(() => {
      smoother.effects('[data-speed], [data-lag]')
      ScrollTrigger.refresh()
      if (window.location.hash) {
        const el = document.querySelector(window.location.hash)
        if (el) smoother.scrollTo(el, true, 'top top')
      } else {
        smoother.scrollTo(0, false)
      }
    }, 100)
    return () => clearTimeout(t)
  }, [pathname])

  // On internal link click: scroll to top immediately so we're at top before the new page loads
  useEffect(() => {
    function onInternalLinkClick(e: MouseEvent) {
      const a = (e.target as Element).closest?.('a[href]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href.startsWith('#') || (a as HTMLAnchorElement).target === '_blank') return
      if (href.startsWith('/')) {
        const smoother = ScrollSmoother.get()
        if (smoother) smoother.scrollTo(0, false)
      }
    }
    document.addEventListener('click', onInternalLinkClick, true)
    return () => document.removeEventListener('click', onInternalLinkClick, true)
  }, [])

  useEffect(() => {
    const smoother = smootherRef.current
    if (!smoother) return

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
        smoother?.scrollTo(target, true, 'top top')
        window.history.pushState(null, '', href)
      }
    }

    document.addEventListener('click', onAnchorClick)
    return () => document.removeEventListener('click', onAnchorClick)
  }, [])

  return (
    <div id={SMOOTHER_WRAPPER_ID}>
      <div id={SMOOTHER_CONTENT_ID}>{children}</div>
    </div>
  )
}
