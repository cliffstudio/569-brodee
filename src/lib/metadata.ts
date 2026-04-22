import type { Metadata } from 'next'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'

type SeoMetadataSource = {
  title?: string | null
  description?: string | null
  socialimage?: {
    asset?: {
      _ref?: string
    }
  } | null
} | null

export function buildSeoMetadata(metaData: SeoMetadataSource): Metadata {
  let socialImageUrl: string | undefined
  if (metaData?.socialimage?.asset?._ref) {
    socialImageUrl = urlFor(metaData.socialimage).width(1200).height(630).url()
  }

  return {
    title: metaData?.title ?? undefined,
    description: metaData?.description ?? undefined,
    openGraph: {
      title: metaData?.title ?? undefined,
      description: metaData?.description ?? undefined,
      ...(socialImageUrl && { images: [socialImageUrl] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData?.title ?? undefined,
      description: metaData?.description ?? undefined,
      ...(socialImageUrl && { images: [socialImageUrl] }),
    },
  }
}
