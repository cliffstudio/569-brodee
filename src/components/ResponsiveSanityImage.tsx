'use client'
/* eslint-disable @next/next/no-img-element */
import type { SanityImage } from '@/types/sanity'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import { getDesktopMobile } from '@/lib/sanityImage'

const MOBILE_BREAKPOINT = '(max-width: 768px)'

interface ResponsiveSanityImageProps {
  desktop: SanityImage
  mobile?: SanityImage | null
  alt?: string
  className?: string
}

/**
 * Renders a Sanity image with optional mobile variant. Uses <picture> when mobile is provided and different from desktop; otherwise a single <img>. Defaults to desktop image when no mobile is set.
 */
export default function ResponsiveSanityImage({
  desktop,
  mobile,
  alt = '',
  className,
}: ResponsiveSanityImageProps) {
  const { desktop: d, mobile: m } = getDesktopMobile(desktop, mobile)
  const desktopUrl = urlFor(d).url()
  const mobileUrl = urlFor(m).url()
  const usePicture = mobile != null && mobileUrl !== desktopUrl

  if (usePicture) {
    return (
      <picture>
        <source media={MOBILE_BREAKPOINT} srcSet={mobileUrl} />
        <img data-src={desktopUrl} alt={alt} className={className} />
      </picture>
    )
  }

  return <img data-src={desktopUrl} alt={alt} className={className} />
}
