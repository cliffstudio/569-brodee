// Documents (multiple per type)
import { pageType } from './documents/pageType'
import { caseStudyType } from './documents/caseStudyType'
import { siteSettingsType } from './documents/siteSettings'

// Sections (content blocks)
import fullWidthMediaSection from './sections/fullWidthMediaSection'
import heroTextSection from './sections/heroTextSection'
import landscapeMediaSection from './sections/landscapeMediaSection'
import landscapeMediaProjectInfoSection from './sections/landscapeMediaProjectInfoSection'
import introWithMediaSection from './sections/introWithMediaSection'
import dualMediaSection from './sections/dualMediaSection'
import doubleMediaWithTextSection from './sections/doubleMediaAndTextSection'
import projectCardSection from './sections/projectCardSection'
import linkCardSection from './sections/linkCardSection'
import quoteSection from './sections/quoteSection'
import imageCarouselSection from './sections/imageCarouselSection'
import spacerSection from './sections/spacerSection'

// Objects
import linkTypes from './objects/links'
import { imageWithMobileType } from './objects/imageWithMobile'
import richPortableText from './objects/richPortableText'
import flexibleContent from './objects/flexibleContent'
import privacyPolicySection from './objects/privacyPolicySection'

export const schemaTypes = [
  // Documents
  pageType,
  caseStudyType,
  siteSettingsType,

  // Sections
  fullWidthMediaSection,
  heroTextSection,
  landscapeMediaSection,
  landscapeMediaProjectInfoSection,
  introWithMediaSection,
  dualMediaSection,
  doubleMediaWithTextSection,
  projectCardSection,
  linkCardSection,
  quoteSection,
  imageCarouselSection,
  spacerSection,

  // Objects (linkTypes is [linkAnnotation, linksArray] - must spread)
  flexibleContent,
  privacyPolicySection,
  ...linkTypes,
  imageWithMobileType,
  richPortableText,
]
