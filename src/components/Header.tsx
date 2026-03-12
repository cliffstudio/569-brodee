'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import Logo from './Logo'
import { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES } from '@/lib/locale'
import { DisableBodyScroll, EnableBodyScroll } from '@/lib/scroll'

const TOP_THRESHOLD = 5
const SCROLL_THRESHOLD = 10

function getScrollY(): number {
  if (typeof window === 'undefined') return 0
  const smoother = ScrollSmoother.get()
  if (smoother) return smoother.scrollTop()
  return window.scrollY ?? window.pageYOffset ?? 0
}

export type HeaderMenuItem = {
  _type: 'internal' | 'external' | 'fileUpload'
  _key: string
  label?: string | null
  pageTitle?: string | null
  slug?: string | null
  url?: string | null
  fileUrl?: string | null
}

function setLocaleCookie(locale: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000`
}

export default function Header({
  menu = [],
  locale = DEFAULT_LOCALE,
}: {
  menu?: HeaderMenuItem[]
  locale?: string
}) {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const isHomePage = pathname === '/' || pathname === ''
  const [isHiddenOnScroll, setIsHiddenOnScroll] = useState(false)
  const lastScrollY = useRef(0)

  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const menuOverlayRef = useRef<HTMLDivElement>(null)
  const innerWrapRef = useRef<HTMLDivElement>(null)
  const menuToggleRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isInitialMount = useRef(true)

  // Header scroll detection
  useEffect(() => {
    lastScrollY.current = getScrollY()

    function onScrollUpdate() {
      const y = getScrollY()
      if (y <= TOP_THRESHOLD) {
        setIsHiddenOnScroll(false)
      } else if (y > lastScrollY.current && y - lastScrollY.current > SCROLL_THRESHOLD) {
        setIsHiddenOnScroll(true)
      } else if (lastScrollY.current - y > SCROLL_THRESHOLD) {
        setIsHiddenOnScroll(false)
      }
      lastScrollY.current = y
    }

    const smoother = ScrollSmoother.get()
    if (smoother) {
      const tickerId = gsap.ticker.add(onScrollUpdate)
      return () => gsap.ticker.remove(tickerId)
    }
    window.addEventListener('scroll', onScrollUpdate, { passive: true })
    return () => window.removeEventListener('scroll', onScrollUpdate)
  }, [])

  // Body scroll detection
  useEffect(() => {
    if (isMenuVisible) {
      DisableBodyScroll()
    } else {
      EnableBodyScroll()
    }
    return () => {
      EnableBodyScroll()
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

  // Menu toggle click
  const handleMenuClick = () => {
    if (window.innerWidth <= 768) {
      setIsMenuVisible(!isMenuVisible)
    }
  }

  // Reset menu state on route change
  useEffect(() => {
    setIsMenuVisible(false)
  }, [pathname])

  // Handle locale click
  function handleLocaleClick(nextLocale: string) {
    if (nextLocale === locale) return
    setLocaleCookie(nextLocale)
    router.refresh()
  }

  return (
    <>
      <header className={`site-header h-pad${isHomePage ? ' is-translated-up' : ''}${isHiddenOnScroll ? ' is-hidden-on-scroll' : ''}${isMenuVisible ? ' is-menu-open' : ''}`}>
        <div className="logo-wrap">
          <Logo />
          <Link href="/" />
        </div>

        <nav className="header-nav" ref={innerWrapRef}>
          {menu.map((item) => {
            const label = item.label || item.pageTitle || 'Link'
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
                  <Link href={href} className="menu-link">
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
            const label = item.label || item.pageTitle || 'Link'
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
                  <Link href={href} className="menu-link">
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
        </nav>
      </div>
    </>
  )
}
