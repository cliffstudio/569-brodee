'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import Logo from './Logo'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  SUPPORTED_LOCALES,
  resolveInternationalized,
  type InternationalizedValue,
} from '@/lib/locale'
import { DisableBodyScroll, EnableBodyScroll } from '@/lib/scroll'

const TOP_THRESHOLD = 5

function getScrollY(): number {
  if (typeof window === 'undefined') return 0
  const smoother = ScrollSmoother.get()
  if (smoother) return smoother.scrollTop()
  return window.scrollY ?? window.pageYOffset ?? 0
}

export type HeaderMenuItem = {
  _type: 'internal' | 'external' | 'fileUpload'
  _key: string
  labelI18n?: InternationalizedValue | null
  pageTitle?: string | null
  slug?: string | null
  url?: string | null
  fileUrl?: string | null
}

function setLocaleCookie(locale: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000`
}

function normalizePath(path: string): string {
  if (!path) return '/'
  if (path === '/') return '/'
  return path.endsWith('/') ? path.slice(0, -1) : path
}

export default function Header({
  menu = [],
  locale = DEFAULT_LOCALE,
  showLanguageSwitcher = true,
}: {
  menu?: HeaderMenuItem[]
  locale?: string
  showLanguageSwitcher?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const isHomePage = pathname === '/' || pathname === ''
  const [isHiddenOnScroll, setIsHiddenOnScroll] = useState(false)
  const [isIntroVisible, setIsIntroVisible] = useState(!isHomePage)
  const lastScrollY = useRef(0)

  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const menuOverlayRef = useRef<HTMLDivElement>(null)
  const innerWrapRef = useRef<HTMLDivElement>(null)
  const menuToggleRef = useRef<HTMLDivElement>(null)
  const cursorSvgRef = useRef<SVGSVGElement | null>(null)
  const cursorShapeRef = useRef<SVGGElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isInitialMount = useRef(true)

  // Header scroll detection
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Track whether we're currently on a mobile viewport
    const mql = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener('change', update)

    lastScrollY.current = getScrollY()

    function onScrollUpdate() {
      const y = getScrollY()

      if (y <= TOP_THRESHOLD) {
        // Always show at the very top of the page
        setIsHiddenOnScroll(false)
      } else if (y > lastScrollY.current) {
        // Hide immediately when scrolling down
        setIsHiddenOnScroll(true)
      } else if (y < lastScrollY.current) {
        // Show immediately when scrolling up
        setIsHiddenOnScroll(false)
      }

      lastScrollY.current = y
    }

    let cleanupScroll: () => void
    const smoother = ScrollSmoother.get()
    if (smoother) {
      const tickerId = gsap.ticker.add(onScrollUpdate)
      cleanupScroll = () => gsap.ticker.remove(tickerId)
    } else {
      addEventListener('scroll', onScrollUpdate, { passive: true })
      cleanupScroll = () => removeEventListener('scroll', onScrollUpdate)
    }

    return () => {
      mql.removeEventListener('change', update)
      cleanupScroll()
    }
  }, [])

  // Homepage intro: fade logo in, then menu.
  useEffect(() => {
    if (!isHomePage) {
      setIsIntroVisible(true)
      return
    }

    setIsIntroVisible(false)
    const introTimer = window.setTimeout(() => {
      setIsIntroVisible(true)
    }, 30)

    return () => {
      window.clearTimeout(introTimer)
    }
  }, [isHomePage])

  // Body scroll detection
  useEffect(() => {
    if (typeof window === 'undefined') return

    const smoother = ScrollSmoother.get()

    if (isMenuVisible) {
      // Stop background scroll while the mobile menu is open.
      DisableBodyScroll()
      smoother?.paused(true)
    } else {
      EnableBodyScroll()
      smoother?.paused(false)
    }

    return () => {
      EnableBodyScroll()
      smoother?.paused(false)
    }
  }, [isMenuVisible])

  // Menu overlay animation
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
  
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  
    const menuOverlay = menuOverlayRef.current
    const innerWrap = innerWrapRef.current
    const menuToggleElement = menuToggleRef.current
  
    if (!menuOverlay || !innerWrap) return
  
    const duration = 250
  
    if (isMenuVisible) {
      menuOverlay.style.pointerEvents = 'all'
      innerWrap.style.pointerEvents = 'none'
  
      const startTime = performance.now()
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        menuOverlay.style.opacity = progress.toString()
        if (menuToggleElement) menuToggleElement.style.opacity = progress.toString()
  
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          menuOverlay.style.opacity = '1'
          if (menuToggleElement) menuToggleElement.style.opacity = '1'
          innerWrap.style.pointerEvents = 'all'
          const innerStartTime = performance.now()
          const animateInner = (currentTime: number) => {
            const elapsed = currentTime - innerStartTime
            const progress = Math.min(elapsed / duration, 1)
            innerWrap.style.opacity = progress.toString()
            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(animateInner)
            } else {
              innerWrap.style.opacity = '1'
              animationFrameRef.current = null
            }
          }
          animationFrameRef.current = requestAnimationFrame(animateInner)
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      innerWrap.style.pointerEvents = 'none'
      const startTime = performance.now()
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        innerWrap.style.opacity = (1 - progress).toString()
  
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          innerWrap.style.opacity = '0'
          menuOverlay.style.pointerEvents = 'none'
          const overlayStartTime = performance.now()
          const animateOverlay = (currentTime: number) => {
            const elapsed = currentTime - overlayStartTime
            const progress = Math.min(elapsed / duration, 1)
            menuOverlay.style.opacity = (1 - progress).toString()
            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(animateOverlay)
            } else {
              menuOverlay.style.opacity = '0'
              if (menuToggleElement) menuToggleElement.style.opacity = '1'
              animationFrameRef.current = null
            }
          }
          animationFrameRef.current = requestAnimationFrame(animateOverlay)
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isMenuVisible])

  // Cursor-following SVG dot
  useEffect(() => {
    if (typeof window === 'undefined') return

    const svg = cursorSvgRef.current
    const cursorShape = cursorShapeRef.current

    if (!svg || !cursorShape) return

    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches
    const isSmallViewport = window.innerWidth <= 1024

    if (isCoarsePointer || isSmallViewport) {
      svg.style.display = 'none'
      return
    }

    svg.style.display = ''

    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const mouse = { x: 0, y: 0 }
    const mouseStored = { ...mouse }

    gsap.set(cursorShape, { transformOrigin: '50% 50%' })
    svg.setAttribute('viewBox', `0 0 ${screen.width} ${screen.height}`)

    const resizeHandler = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    }

    const setMouseCoords = (event: MouseEvent) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }

    const animateDot = () => {
      if (mouseStored.x === mouse.x && mouseStored.y === mouse.y) return

      gsap.to(cursorShape, {
        x: mouse.x,
        y: mouse.y,
        ease: 'elastic.out(1.25, 1)',
        duration: 2,
        delay: 0.1,
      })

      mouseStored.x = mouse.x
      mouseStored.y = mouse.y
    }

    window.addEventListener('mousemove', setMouseCoords)
    window.addEventListener('resize', resizeHandler)
    const tickerCallback = gsap.ticker.add(animateDot)

    return () => {
      window.removeEventListener('mousemove', setMouseCoords)
      window.removeEventListener('resize', resizeHandler)
      gsap.ticker.remove(tickerCallback)
    }
  }, [])

  // Menu toggle click
  const handleMenuClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setIsMenuVisible(!isMenuVisible)
    }
  }

  // Internal link click handler: on mobile, force a full page navigation so that
  // each page load starts at the top using the browser's default behavior.
  const handleInternalLinkClick = (href: string) => (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (typeof window === 'undefined') return
    const isSamePath = normalizePath(pathname) === normalizePath(href)

    // Avoid re-navigating to the same route, which can trip teardown races.
    if (isSamePath) {
      event.preventDefault()
      setIsMenuVisible(false)
      return
    }

    if (!isMobile) return

    // Keep navigation in-app so React/GSAP teardown stays consistent.
    event.preventDefault()
    setIsMenuVisible(false)
    router.push(href)
  }

  // Reset menu state on route change
  useEffect(() => {
    setIsMenuVisible(false)
  }, [pathname])

  // Handle locale click
  function handleLocaleClick(nextLocale: string) {
    if (nextLocale === locale) return
    setLocaleCookie(nextLocale)
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <>
      <header
        className={`site-header h-pad${isHomePage ? ' is-home-intro' : ''}${isHomePage && isIntroVisible ? ' is-home-intro-visible' : ''}${isHiddenOnScroll ? ' is-hidden-on-scroll' : ''}${isMenuVisible ? ' is-menu-open' : ''}`}
      >
        <div className="logo-wrap">
          <Logo />
          <Link href="/" />
        </div>

        <nav className="header-nav text-s" ref={innerWrapRef}>
          {menu.map((item) => {
            const localizedLabel = resolveInternationalized(item.labelI18n ?? undefined, locale)
            const label = localizedLabel || item.pageTitle || 'Link'
            const isInternal = item._type === 'internal' && item.slug !== undefined && item.slug !== null
            const href = isInternal
              ? item.slug === '' ? '/' : `/${item.slug}`
              : item._type === 'external' && item.url
                ? item.url
                : item._type === 'fileUpload' && item.fileUrl
                  ? item.fileUrl
                  : '#'
            const isActive = isInternal && normalizePath(pathname) === normalizePath(href)

            return (
              <div key={item._key} className="menu-item">
                {isInternal ? (
                  <Link
                    href={href}
                    className={`menu-link${isActive ? ' is-active' : ''}`}
                    onClick={handleInternalLinkClick(href)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href={href}
                    className="menu-link"
                    {...(item._type === 'external' && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {label}
                  </a>
                )}
              </div>
            )
          })}

          {showLanguageSwitcher && (
            <div className="language-switcher">
              {SUPPORTED_LOCALES.map((lang) => (
                <div
                  key={lang.id}
                  className={`menu-link${locale === lang.id ? ' is-active' : ''}`}
                  onClick={() => handleLocaleClick(lang.id)}
                  aria-current={locale === lang.id ? 'true' : undefined}
                >
                  {lang.label}
                </div>
              ))}
            </div>
          )}
        </nav>

        <div ref={menuToggleRef} className={`menu-toggle mobile${isMenuVisible ? ' active' : ''}`} onClick={handleMenuClick} role="button" aria-expanded={isMenuVisible} aria-label={isMenuVisible ? 'Close menu' : 'Open menu'}>
          <div className="menu-bar" data-position="top" />
          <div className="menu-bar" data-position="middle" />
          <div className="menu-bar" data-position="bottom" />
        </div>
      </header>

      <div ref={menuOverlayRef} className={`menu-overlay${isMenuVisible ? ' visible' : ''}`}>
        <nav className="menu-overlay-nav h-pad">
          {menu.map((item) => {
            const localizedLabel = resolveInternationalized(item.labelI18n ?? undefined, locale)
            const label = localizedLabel || item.pageTitle || 'Link'
            const isInternal = item._type === 'internal' && item.slug !== undefined && item.slug !== null
            const href = isInternal
              ? item.slug === '' ? '/' : `/${item.slug}`
              : item._type === 'external' && item.url
                ? item.url
                : item._type === 'fileUpload' && item.fileUrl
                  ? item.fileUrl
                  : '#'

            return (
              <div key={item._key} className="menu-item">
                {isInternal ? (
                  <Link
                    href={href}
                    className="menu-link"
                    onClick={handleInternalLinkClick(href)}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href={href}
                    className="menu-link"
                    {...(item._type === 'external' && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {label}
                  </a>
                )}
              </div>
            )
          })}

          {showLanguageSwitcher && (
            <div className="language-switcher">
              {SUPPORTED_LOCALES.map((lang) => (
                <div
                  key={lang.id}
                  className={`menu-link${locale === lang.id ? ' is-active' : ''}`}
                  onClick={() => handleLocaleClick(lang.id)}
                  aria-current={locale === lang.id ? 'true' : undefined}
                >
                  {lang.label}
                </div>
              ))}
            </div>
          )}
        </nav>
      </div>

      <svg
        ref={cursorSvgRef}
        className="cursor-svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g ref={cursorShapeRef} className="cursor-shape">
          <path
            className="cursor-arrow cursor-arrow-right"
            d="M4 3.5L11.5 -4L4 -11.5"
          />
          <path
            className="cursor-arrow cursor-arrow-right"
            d="M11.5 -4H-9.5"
          />
          <path
            className="cursor-arrow cursor-arrow-left"
            d="M-4 3.5L-11.5 -4L-4 -11.5"
          />
          <path
            className="cursor-arrow cursor-arrow-left"
            d="M-11.5 -4H9.5"
          />
        </g>
      </svg>
    </>
  )
}
