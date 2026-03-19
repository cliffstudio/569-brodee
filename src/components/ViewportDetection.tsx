'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ViewportDetection() {
  const pathname = usePathname()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    let ctx: gsap.Context | null = null

    const timeoutId = window.setTimeout(() => {
      ctx = gsap.context(() => {
        const elements = gsap.utils.toArray<HTMLElement>(
          '.out-of-view, .out-of-opacity'
        )

        ScrollTrigger.batch(elements, {
          start: 'top 100%',
          onEnter: (batch) => {
            ;(batch as HTMLElement[]).forEach((el, index) => {
              const isOutOfView = el.classList.contains('out-of-view')
              const animationName = isOutOfView ? 'fadeInUp' : 'fadeIn'
              const delay = 0.3 + index * 0.3

              el.style.animation = `${animationName} 1750ms cubic-bezier(0.19, 1, 0.22, 1) ${delay}s both`
            })
          },
        })

        ScrollTrigger.refresh()
      })
    }, 200)

    return () => {
      window.clearTimeout(timeoutId)
      ctx?.revert()
    }
  }, [pathname])

  return null
}