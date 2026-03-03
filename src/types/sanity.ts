export type SanityImage = {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

/** Bunny Stream video (from @cliff-studio/sanity-plugin-bunny-input) */
export type SanityBunnyVideo = {
  _type: 'bunnyVideo'
  videoId: string
  libraryId: string
  title?: string
  status?: 'uploading' | 'processing' | 'ready' | 'error'
  thumbnailUrl?: string
  playbackUrl: string
  mp4Url: string
  duration?: number
}

export type SanityVideo = string | SanityBunnyVideo

/** Reference to a project document (e.g. projectCardSection card1, card2, card3). */
export type Project = {
  _type: 'reference'
  _ref: string
}

/** Resolved project card (main image, title, page link) for projectCardSection. */
export type ProjectCard = {
  mainImage?: SanityImage | null
  title?: string | null
  slug?: string | null
} | null

export type PortableTextBlock = {
  _type: string
  children: Array<{
    _type: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
  }>
}
