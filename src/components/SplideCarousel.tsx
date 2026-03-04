'use client'

/* eslint-disable @next/next/no-img-element */
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/css'
import { useRef } from 'react'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'

interface SplideCarouselProps {
  images: Array<{ desktopUrl: string; mobileUrl?: string; alt?: string }>
  autoplay?: boolean
  arrows?: boolean
  onPrevious?: () => void
  onNext?: () => void
}

export default function SplideCarousel({
  images,
  autoplay = true,
  arrows = false,
  onPrevious,
  onNext,
}: SplideCarouselProps) {
  const splideRef = useRef<{ go: (direction: string) => void } | null>(null)

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
    pauseOnHover: !autoplay,
    resetProgress: false,
  }

  return (
    <div className="carousel-container">
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
      <div className="carousel-left" onClick={handlePrevious}>
        <ArrowRightIcon />
      </div>

      <div className="carousel-right" onClick={handleNext}>
        <ArrowRightIcon />
      </div>
    </div>
  )
}
