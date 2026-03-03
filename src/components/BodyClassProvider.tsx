'use client'

import { useEffect } from 'react'

interface BodyClassProviderProps {
  page?: string
  /** Page background from Sanity (espresso, terracotta, chalk, charcoal) – added as body class bg-{value} */
  background?: string | null
}

export default function BodyClassProvider({ page, background }: BodyClassProviderProps) {
  useEffect(() => {
    // Remove any existing page class and our bg- classes
    const existingClasses = document.body.className.split(' ').filter(
      (cls) => cls.startsWith('page-') || cls.startsWith('bg-')
    )
    existingClasses.forEach((cls) => document.body.classList.remove(cls))

    // Add page class (e.g. page-home)
    if (page) {
      const pageClass = `page-${page.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`
      if (pageClass !== 'page-') {
        document.body.classList.add(pageClass)
      }
    }

    // Add background class (e.g. bg-espresso, bg-terracotta)
    if (background && /^[a-z]+$/.test(background)) {
      document.body.classList.add(`bg-${background}`)
    }

    return () => {
      if (page) {
        const pageClass = `page-${page.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`
        if (pageClass !== 'page-') {
          document.body.classList.remove(pageClass)
        }
      }
      if (background && /^[a-z]+$/.test(background)) {
        document.body.classList.remove(`bg-${background}`)
      }
    }
  }, [page, background])

  return null
}
