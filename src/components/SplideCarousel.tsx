'use client'

/* eslint-disable @next/next/no-img-element */
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/css'
import { useRef } from 'react'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'

interface SplideCarouselProps {
  images: Array<{ desktopUrl: string; mobileUrl?: string; alt?: string }>
  autoplay?: boolean
  interval?: number
  arrows?: boolean
  onPrevious?: () => void
  onNext?: () => void
}

export default function SplideCarousel({
  images,
  autoplay = true,
  interval = 1800,
  arrows = false,
  onPrevious,
  onNext,
}: SplideCarouselProps) {
  const splideRef = useRef<{ go: (direction: string) => void } | null>(null)

  const setCursorMode = (mode?: 'arrow-left' | 'arrow-right') => {
    if (typeof document === 'undefined') return
    document.body.classList.remove('cursor-arrow-left', 'cursor-arrow-right')
    if (mode) {
      document.body.classList.add(`cursor-${mode}`)
    }
  }

  const handlePrevious = () => {
    if (splideRef.current) {
      splideRef.current.go('<')
    }
    onPrevious?.()
  }

  const handleNext = () => {
    if (splideRef.current) {
      splideRef.current.go('>')
    }
    onNext?.()
  }

  const splideOptions = {
    type: 'fade',
    rewind: true,
    arrows,
    pagination: false,
    lazyLoad: 'nearby' as const,
    autoplay,
    interval,
    speed: 1700,
    pauseOnHover: !autoplay,
    resetProgress: false,
    drag: false,
  }

  return (
    <div
      className="carousel-container out-of-opacity"
      onMouseLeave={() => setCursorMode()}
    >
      <Splide
        ref={splideRef}
        options={splideOptions}
        className="splide-carousel"
      >
        {images.map((image, index) => (
          <SplideSlide key={index}>
            {image.desktopUrl && (
              <img data-src={image.desktopUrl} alt={image.alt ?? ''} className="lazy full-bleed-image desktop" />
            )}

            {image.mobileUrl && (
              <img data-src={image.mobileUrl} alt={image.alt ?? ''} className="lazy full-bleed-image mobile" />
            )}

            {!image.mobileUrl && image.desktopUrl && (
              <img data-src={image.desktopUrl} alt={image.alt ?? ''} className="lazy full-bleed-image mobile" />
            )}

            <div className="loading-overlay" />
          </SplideSlide>
        ))}
      </Splide>
      <div
        className="carousel-left"
        onClick={handlePrevious}
        onMouseEnter={() => setCursorMode('arrow-left')}
        onMouseLeave={() => setCursorMode()}
      >
        <ArrowRightIcon />
      </div>
      <div
        className="carousel-right"
        onClick={handleNext}
        onMouseEnter={() => setCursorMode('arrow-right')}
        onMouseLeave={() => setCursorMode()}
      >
        <ArrowRightIcon />
      </div>
    </div>
  )
}
