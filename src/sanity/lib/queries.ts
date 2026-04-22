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

// Array item: plain image (legacy) or imageWithMobile object
const imageArrayItemFragment = groq`{
  _type,
  asset, hotspot, crop,
  "image": image ${imageFragment},
  "mobileImage": mobileImage ${imageFragment}
}`
const fullWidthMediaSectionFields = groq`mediaType, "images": images[] ${imageArrayItemFragment}, video, videoMobile`
const heroTextCtaLink = groq`cta[0] {
  _type,
  "labelI18n": labelI18n[] { _key, value },
  "label": coalesce(labelI18n[0].value, page->title),
  url,
  "slug": select(
    page->_type == "caseStudy" => "works/" + page->slug.current,
    page->slug.current
  ),
  "fileUrl": file.asset->url
}`
const heroTextSectionFields = groq`newTitle, newTitleMobile, copy, alignment, ${heroTextCtaLink}`
const landscapeMediaFields = groq`mediaType, "image": image ${imageFragment}, "imageMobile": imageMobile ${imageFragment}, video, caption, alignment`
const landscapeMediaProjectInfoSectionFields = groq`mediaType, "image": image ${imageFragment}, "imageMobile": imageMobile ${imageFragment}, video, projectInfo[] { _key, title, copy }`
const dualMediaFields = groq`mediaType1, "image1": image1 ${imageFragment}, "image1Mobile": image1Mobile ${imageFragment}, video1, mediaType2, "image2": image2 ${imageFragment}, "image2Mobile": image2Mobile ${imageFragment}, video2, alignment`
const doubleMediaWithTextCta1Link = groq`cta1[0] {
  _type,
  "labelI18n": labelI18n[] { _key, value },
  "label": coalesce(labelI18n[0].value, page->title),
  url,
  "slug": select(
    page->_type == "caseStudy" => "works/" + page->slug.current,
    page->slug.current
  ),
  "fileUrl": file.asset->url
}`
const doubleMediaWithTextCta2Link = groq`cta[0] {
  _type,
  "labelI18n": labelI18n[] { _key, value },
  "label": coalesce(labelI18n[0].value, page->title),
  url,
  "slug": select(
    page->_type == "caseStudy" => "works/" + page->slug.current,
    page->slug.current
  ),
  "fileUrl": file.asset->url
}`
const doubleMediaWithTextFields = groq`mediaType1, "image1": image1 ${imageFragment}, "image1Mobile": image1Mobile ${imageFragment}, video1, title1, copy1, ${doubleMediaWithTextCta1Link}, mediaType2, "image2": image2 ${imageFragment}, "image2Mobile": image2Mobile ${imageFragment}, video2, title2, copy2, ${doubleMediaWithTextCta2Link}`
const projectCardFields = groq`"mainImage": mainImage ${imageFragment}, "mainImageMobile": mainImageMobile ${imageFragment}, title, "slug": slug.current`
const projectCardSectionFields = groq`title, numberOfCards,
  "card1": card1-> { ${projectCardFields} },
  "card2": card2-> { ${projectCardFields} },
  "card3": card3-> { ${projectCardFields} }`
const linkCardItemFields = groq`{
  "link": link {
    label,
    href,
    openInNewTab
  },
  "image": image ${imageFragment}
}`
const linkCardSectionFields = groq`title, numberOfCards,
  "card1": card1 ${linkCardItemFields},
  "card2": card2 ${linkCardItemFields},
  "card3": card3 ${linkCardItemFields}`
const introWithMediaCtaLink = groq`cta[0] {
  _type,
  "labelI18n": labelI18n[] { _key, value },
  "label": coalesce(labelI18n[0].value, page->title),
  url,
  "slug": select(
    page->_type == "caseStudy" => "works/" + page->slug.current,
    page->slug.current
  ),
  "fileUrl": file.asset->url
}`
const introWithMediaFields = groq`mediaType, title, "image": image ${imageFragment}, "imageMobile": imageMobile ${imageFragment}, video, copy, alignment,
  ${introWithMediaCtaLink}`

const quoteSectionFields = groq`quote, author`
const imageCarouselSectionFields = groq`"images": images[] ${imageArrayItemFragment}`
const spacerSectionFields = groq`heightDesktop, heightMobile`

const contentBlocksFragment = groq`contentBlocks[] {
  _type,
  _key,
  ...select(_type == "fullWidthMediaSection" => { ${fullWidthMediaSectionFields} }),
  ...select(_type == "heroTextSection" => { ${heroTextSectionFields} }),
  ...select(_type == "landscapeMediaSection" => { ${landscapeMediaFields} }),
  ...select(_type == "landscapeMediaProjectInfoSection" => { ${landscapeMediaProjectInfoSectionFields} }),
  ...select(_type == "introWithMediaSection" => { ${introWithMediaFields} }),
  ...select(_type == "dualMediaSection" => { ${dualMediaFields} }),
  ...select(_type == "doubleMediaWithTextSection" => { ${doubleMediaWithTextFields} }),
  ...select(_type == "projectCardSection" => { ${projectCardSectionFields} }),
  ...select(_type == "linkCardSection" => { ${linkCardSectionFields} }),
  ...select(_type == "quoteSection" => { ${quoteSectionFields} }),
  ...select(_type == "imageCarouselSection" => { ${imageCarouselSectionFields} }),
  ...select(_type == "spacerSection" => { ${spacerSectionFields} })
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
    seo {
      metaTitle,
      metaDescription,
      socialimage ${imageFragment}
    },
    template,
    backgroundColour,
    ${contentBlocksFragment},
    policySections[] {
      title[] { _key, value },
      text[] { _key, value }
    }
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
    mainImage ${imageFragment},
    mainImageMobile ${imageFragment}
  }
`

export const caseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    seo {
      metaTitle,
      metaDescription,
      socialimage ${imageFragment}
    },
    publishedAt,
    excerpt,
    mainImage ${imageFragment},
    mainImageMobile ${imageFragment},
    body,
    backgroundColour,
    ${contentBlocksFragment}
  }
`

export const pageMetadataBySlugQuery = groq`
  *[_type == "page" && (
    ($slug == "" && (!defined(slug.current) || slug.current == "" || slug.current == null)) ||
    ($slug != "" && slug.current == $slug)
  )][0] {
    "title": coalesce(
      seo.metaTitle,
      coalesce(*[_id == "drafts.siteSettings"][0].title, *[_id == "siteSettings"][0].title)
    ),
    "description": coalesce(
      seo.metaDescription,
      coalesce(*[_id == "drafts.siteSettings"][0].description, *[_id == "siteSettings"][0].description)
    ),
    "socialimage": coalesce(
      seo.socialimage,
      coalesce(*[_id == "drafts.siteSettings"][0].socialimage, *[_id == "siteSettings"][0].socialimage)
    )
  }
`

export const caseStudyMetadataBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    "title": coalesce(
      seo.metaTitle,
      coalesce(*[_id == "drafts.siteSettings"][0].title, *[_id == "siteSettings"][0].title)
    ),
    "description": coalesce(
      seo.metaDescription,
      coalesce(*[_id == "drafts.siteSettings"][0].description, *[_id == "siteSettings"][0].description)
    ),
    "socialimage": coalesce(
      seo.socialimage,
      coalesce(*[_id == "drafts.siteSettings"][0].socialimage, *[_id == "siteSettings"][0].socialimage)
    )
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
  showLanguageSwitcher,
  headerMenu[] {
    _type,
    _key,
    "labelI18n": labelI18n[] { _key, value },
    "slug": ${internalLinkSlug},
    "pageTitle": ${internalLinkTitle},
    url,
    "fileUrl": file.asset->url
  },
  "footer": footer[] { _key, value },
  footerMenu[] {
    _key,
    "iconUrl": icon.asset->url,
    "link": {
      "href": link.href,
      "openInNewTab": link.openInNewTab
    }
  },
  footerText
}`

export const headerMenuQuery = groq`coalesce(
  *[_id == "drafts.siteSettings"][0] ${siteSettingsProjection},
  *[_id == "siteSettings"][0] ${siteSettingsProjection}
)`

