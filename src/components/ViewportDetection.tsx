'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ViewportDetection() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    // Delay setup slightly so the initial hydration can finish
    // before we start mutating inline styles for animations.
    const timeoutId = window.setTimeout(() => {
      const elements = gsap.utils.toArray<HTMLElement>(
        '.out-of-view, .out-of-opacity'
      )

      ScrollTrigger.batch(elements, {
        // Trigger when the top of the element
        // reaches the bottom edge of the viewport (enters view)
        start: 'top 100%',
        onEnter: (batch) => {
          ;(batch as HTMLElement[]).forEach((el, index) => {
            const isOutOfView = el.classList.contains('out-of-view')
            const animationName = isOutOfView ? 'fadeInUp' : 'fadeIn'
            const delay = 0.4 + index * 0.4

            el.style.animation = `${animationName} 2000ms cubic-bezier(0.19, 1, 0.22, 1) ${delay}s both`
          })
        },
      })

      ScrollTrigger.refresh()
    }, 200)

    return () => {
      window.clearTimeout(timeoutId)
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return null
}
