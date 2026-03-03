// src/sanity/lib/queries.ts
import { groq } from 'next-sanity'

/**
 * Simplified query system
 */

// Reusable fragments for consistency and maintainability
const imageFragment = groq`{
  asset {
    _ref,
    _type
  },
  hotspot,
  crop
}`

// Note: videoFragment kept for backward compatibility but video fields now use URL strings
const videoFragment = groq`{
  asset {
    _ref,
    _type
  }
}`

// Resolve internal link path (pages use slug; projects/case studies use /works/[slug])
const internalLinkSlug = groq`select(
  page->_type == "caseStudy" => "works/" + page->slug.current,
  page->slug.current
)`

// Resolve internal link label from document title
const internalLinkTitle = groq`page->title`

const linkFragment = groq`{
  linkType,
  label,
  href,
  jumpLink,
  bookingTab,
  color,
  file {
    asset {
      _ref,
      _type,
      originalFilename
    }
  },
  pageLink {
    _ref,
    _type,
    "slug": ${internalLinkSlug},
    "title": ${internalLinkTitle}
  }
}`

const footerLinkFragment = groq`{
  linkType,
  label,
  href,
  jumpLink,
  file {
    asset {
      _ref,
      _type,
      originalFilename
    }
  },
  pageLink {
    _ref,
    _type,
    "slug": ${internalLinkSlug},
    "title": ${internalLinkTitle}
  }
}`

// ——— Content block fragments (flexible content) ———

const fullWidthMediaSectionFields = groq`mediaType, "images": images[] ${imageFragment}, video`
const heroTextCtaLink = groq`cta[0] {
  _type,
  label,
  url,
  "slug": select(
    page->_type == "caseStudy" => "works/" + page->slug.current,
    page->slug.current
  ),
  "fileUrl": file.asset->url
}`
const heroTextSectionFields = groq`title, copy, alignment, ${heroTextCtaLink}`
const landscapeMediaFields = groq`mediaType, "image": image ${imageFragment}, video, caption, alignment`
const landscapeMediaProjectInfoSectionFields = groq`mediaType, "image": image ${imageFragment}, video, projectInfo[] { _key, title, copy }`
const dualMediaFields = groq`mediaType1, "image1": image1 ${imageFragment}, video1, mediaType2, "image2": image2 ${imageFragment}, video2, alignment`
const projectCardFields = groq`"mainImage": mainImage ${imageFragment}, title, "slug": slug.current`
const projectCardSectionFields = groq`title, numberOfCards,
  "card1": card1-> { ${projectCardFields} },
  "card2": card2-> { ${projectCardFields} },
  "card3": card3-> { ${projectCardFields} }`
const introWithMediaCtaLink = groq`cta[0] {
  _type,
  label,
  url,
  "slug": select(
    page->_type == "caseStudy" => "works/" + page->slug.current,
    page->slug.current
  ),
  "fileUrl": file.asset->url
}`
const introWithMediaFields = groq`mediaType, "image": image ${imageFragment}, video, copy, alignment,
  ${introWithMediaCtaLink}`

const textTitleSectionFields = groq`title, copy`
const quoteSectionFields = groq`quote, author`
const logoCarouselSectionFields = groq`title, "images": images[] ${imageFragment}`
const imageCarouselSectionFields = groq`"images": images[] ${imageFragment}`

const contentBlocksFragment = groq`contentBlocks[] {
  _type,
  _key,
  ...select(_type == "fullWidthMediaSection" => { ${fullWidthMediaSectionFields} }),
  ...select(_type == "heroTextSection" => { title, copy, alignment, ${heroTextCtaLink} }),
  ...select(_type == "landscapeMediaSection" => { mediaType, "image": image ${imageFragment}, video, caption, alignment }),
  ...select(_type == "landscapeMediaProjectInfoSection" => { ${landscapeMediaProjectInfoSectionFields} }),
  ...select(_type == "introWithMediaSection" => { mediaType, "image": image ${imageFragment}, video, copy, alignment, ${introWithMediaCtaLink} }),
  ...select(_type == "dualMediaSection" => { mediaType1, "image1": image1 ${imageFragment}, video1, mediaType2, "image2": image2 ${imageFragment}, video2, alignment }),
  ...select(_type == "projectCardSection" => { title, numberOfCards,
  "card1": card1-> { ${projectCardFields} },
  "card2": card2-> { ${projectCardFields} },
  "card3": card3-> { ${projectCardFields} } }),
  ...select(_type == "textTitleSection" => { ${textTitleSectionFields} }),
  ...select(_type == "quoteSection" => { ${quoteSectionFields} }),
  ...select(_type == "logoCarouselSection" => { ${logoCarouselSectionFields} }),
  ...select(_type == "imageCarouselSection" => { ${imageCarouselSectionFields} })
}`

// ——— Pages ———

/** Fetch a single page by slug (use slug: "" for homepage). Homepage = page with no slug or empty slug. */
export const pageBySlugQuery = groq`
  *[_type == "page" && (
    ($slug == "" && (!defined(slug.current) || slug.current == "" || slug.current == null)) ||
    ($slug != "" && slug.current == $slug)
  )][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    template,
    backgroundColour,
    ${contentBlocksFragment},
    policySections[] { title, text }
  }
`

export const pageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)] {
    "slug": slug.current
  }
`

// ——— Case Studies (post type) ———

export const caseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage ${imageFragment}
  }
`

export const caseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage ${imageFragment},
    body,
    backgroundColour,
    ${contentBlocksFragment}
  }
`

export const caseStudySlugsQuery = groq`
  *[_type == "caseStudy" && defined(slug.current)] {
    "slug": slug.current
  }
`

// ——— Search ———

export const siteSearchQuery = groq`
  {
    "caseStudies": *[_type == "caseStudy" && (
      title match $wildcardTerm ||
      slug.current match $wildcardTerm ||
      excerpt match $wildcardTerm
    )] | order(publishedAt desc) {
      _id,
      title,
      "slug": "works/" + slug.current,
      "descriptionPlain": excerpt,
      "resultType": "caseStudy"
    }
  }
`

// Footer and menu queries
export const footerQuery = groq`
  *[_type == "footer"][0] {
    _id,
    navigationColumn1 {
      heading,
      links[] ${footerLinkFragment}
    },
    navigationColumn2 {
      heading,
      links[] ${footerLinkFragment}
    },
    followColumn {
      heading,
      links[] ${footerLinkFragment}
    },
    contactColumn {
      heading,
      contactItems[] {
        label,
        phoneNumber,
        extension
      }
    },
    announcementPopup {
      enabled,
      slides[] {
        image ${imageFragment},
        title,
        text,
        button ${linkFragment}
      }
    }
  }
`

export const menuQuery = groq`
  *[_type == "menu"][0] {
    _id,
    title,
    items[] {
      linkType,
      label,
      href,
      pageLink-> {
        _id,
        title,
        "slug": slug.current
      }
    }
  }
`

// Metadata query (from Site Settings)
export const metadataQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    title,
    description,
    socialimage ${imageFragment}
  }
`

// Site settings with header menu and footer (resolved links: internal → path/title, external → url, file → fileUrl)
// Use coalesce so we get draft first (if exists), then published singleton
const siteSettingsProjection = groq`{
  headerMenu[] {
    _type,
    _key,
    label,
    "slug": ${internalLinkSlug},
    "pageTitle": ${internalLinkTitle},
    url,
    "fileUrl": file.asset->url
  },
  "footer": footer[] { _key, value },
  footerMenu[] {
    _type,
    _key,
    label,
    "slug": ${internalLinkSlug},
    "pageTitle": ${internalLinkTitle},
    url,
    "fileUrl": file.asset->url
  },
  footerText
}`

export const headerMenuQuery = groq`coalesce(
  *[_id == "drafts.siteSettings"][0] ${siteSettingsProjection},
  *[_id == "siteSettings"][0] ${siteSettingsProjection}
)`

// Export fragments for reuse in other queries if needed
export const fragments = {
  imageFragment,
  videoFragment,
  linkFragment
}
