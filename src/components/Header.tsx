'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import Logo from './Logo'
import { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES } from '@/lib/locale'

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
  const pathname = usePathname()
  const isHomePage = pathname === '/' || pathname === ''
  const [isHiddenOnScroll, setIsHiddenOnScroll] = useState(false)
  const lastScrollY = useRef(0)

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

  function handleLocaleClick(nextLocale: string) {
    if (nextLocale === locale) return
    setLocaleCookie(nextLocale)
    router.refresh()
  }

  return (
    <header
        className={`site-header h-pad${isHomePage ? ' is-translated-up' : ''}${isHiddenOnScroll ? ' is-hidden-on-scroll' : ''}`}
      >
      <div className="logo-wrap">
        <Logo />
        <Link href="/" />
      </div>

      <nav className="header-nav">
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
    </header>
  )
}
