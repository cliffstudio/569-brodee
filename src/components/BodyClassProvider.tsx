'use client'

import { useEffect } from 'react'

interface BodyClassProviderProps {
  page?: string
  /** Page background from Sanity (espresso, terracotta, chalk, charcoal) – added as body class bg-{value} */
  background?: string | null
}

const backgroundToThemeColor: Record<string, string> = {
  black: '#000000',
  charcoal: '#231F20',
  espresso: '#350D00',
  walnut: '#6D422D',
  fern: '#334E28',
  terracotta: '#A04918',
  birch: '#B28562',
  sage: '#A59267',
  chalk: '#FBEAD6',
  white: '#FFFFFF',
}

export default function BodyClassProvider({ page, background }: BodyClassProviderProps) {
  useEffect(() => {
    // Remove any existing page class and our bg- classes from body and html
    const bodyClassesToRemove = document.body.className
      .split(' ')
      .filter((cls) => cls.startsWith('page-') || cls.startsWith('bg-'))
    bodyClassesToRemove.forEach((cls) => document.body.classList.remove(cls))

    const htmlClassesToRemove = document.documentElement.className
      .split(' ')
      .filter((cls) => cls.startsWith('bg-'))
    htmlClassesToRemove.forEach((cls) => document.documentElement.classList.remove(cls))

    // Add page class (e.g. page-home)
    if (page) {
      const pageClass = `page-${page.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`
      if (pageClass !== 'page-') {
        document.body.classList.add(pageClass)
      }
    }

    // Add background class (e.g. bg-espresso, bg-terracotta)
    if (background && /^[a-z]+$/.test(background)) {
      const bgClass = `bg-${background}`
      document.body.classList.add(bgClass)
      document.documentElement.classList.add(bgClass)

      // Update theme-color meta tag to match background
      const themeColor = backgroundToThemeColor[background]
      if (themeColor) {
        let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
        if (!meta) {
          meta = document.createElement('meta')
          meta.name = 'theme-color'
          document.head.appendChild(meta)
        }
        meta.content = themeColor
      }
    }

    return () => {
      if (page) {
        const pageClass = `page-${page.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`
        if (pageClass !== 'page-') {
          document.body.classList.remove(pageClass)
        }
      }
      if (background && /^[a-z]+$/.test(background)) {
        const bgClass = `bg-${background}`
        document.body.classList.remove(bgClass)
        document.documentElement.classList.remove(bgClass)

        // Do not remove the meta tag entirely on cleanup so browser chrome
        // keeps the last-set theme color; it will be updated on the next page.
      }
    }
  }, [page, background])

  return null
}
