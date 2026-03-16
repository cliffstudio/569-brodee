'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function MobileScrollReset() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  // Track whether we're currently on a mobile viewport using a media query.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia('(max-width: 768px)')

    const update = () => {
      setIsMobile(mql.matches)
    }

    update()
    mql.addEventListener('change', update)

    return () => {
      mql.removeEventListener('change', update)
    }
  }, [])

  // On mobile, force scroll position to the top on every route change so that
  // pages never inherit the previous scroll position.
  useEffect(() => {
    if (!isMobile) return
    if (typeof window === 'undefined') return

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const id = window.setTimeout(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 50)

    return () => {
      window.clearTimeout(id)
    }
  }, [pathname, isMobile])

  return null
}

