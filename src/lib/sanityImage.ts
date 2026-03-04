import type { SanityImage, SanityImageArrayItem } from '@/types/sanity'

/** Resolve desktop and mobile image from optional mobile (defaults to desktop). */
export function getDesktopMobile(
  desktop: SanityImage,
  mobile?: SanityImage | null
): { desktop: SanityImage; mobile: SanityImage } {
  return { desktop, mobile: mobile ?? desktop }
}

/** Normalize array item (plain image or imageWithMobile) to desktop + mobile. */
export function normalizeImageArrayItem(
  item: SanityImageArrayItem
): { desktop: SanityImage; mobile: SanityImage } {
  if (item && '_type' in item && item._type === 'imageWithMobile' && item.image) {
    return {
      desktop: item.image,
      mobile: item.mobileImage ?? item.image,
    }
  }
  const img = item as SanityImage
  return { desktop: img, mobile: img }
}
