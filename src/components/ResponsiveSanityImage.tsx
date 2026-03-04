'use client'
/* eslint-disable @next/next/no-img-element */
import type { SanityImage } from '@/types/sanity'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import { getDesktopMobile } from '@/lib/sanityImage'

interface ResponsiveSanityImageProps {
  desktop: SanityImage
  mobile?: SanityImage | null
  alt?: string
  className?: string
}

export default function ResponsiveSanityImage({
  desktop,
  mobile,
  alt = '',
  className = '',
}: ResponsiveSanityImageProps) {
  const { desktop: d, mobile: m } = getDesktopMobile(desktop, mobile)
  const desktopUrl = urlFor(d).url()
  const mobileUrl = urlFor(m).url()

  if (!desktop) return null

  const cn = (suffix: string) => `${className} ${suffix}`.trim()

  return (
    <>
      <img data-src={desktopUrl} alt={alt} className={cn('desktop')} />
      <img data-src={mobileUrl} alt={alt} className={cn('mobile')} />
      <div className="loading-overlay" />
    </>
  )
}
