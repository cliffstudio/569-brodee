import type { SanityBunnyVideo, SanityImage, SanityImageArrayItem } from '@/types/sanity'
import type {
  InternationalizedPortableText,
  InternationalizedValue,
} from '@/lib/locale'
import type { LandscapeMediaSectionProps } from './sections/LandscapeMediaSection'
import type { PortraitMediaSectionProps } from './sections/PortraitMediaSection'
import type { ProjectInfoItem } from './sections/LandscapeMediaProjectInfoSection'
import type { IntroWithMediaCta } from './sections/IntroWithMediaSection'
import type { HeroTextSectionCta } from './sections/HeroTextSection'
import FullWidthMediaSection from './sections/FullWidthMediaSection'
import HeroTextSection from '@/components/sections/HeroTextSection'
import LandscapeMediaSection from './sections/LandscapeMediaSection'
import PortraitMediaSection from './sections/PortraitMediaSection'
import LandscapeMediaProjectInfoSection from './sections/LandscapeMediaProjectInfoSection'
import IntroWithMediaSection from './sections/IntroWithMediaSection'
import DualMediaSection from './sections/DualMediaSection'
import ProjectCardSection from './sections/ProjectCardSection'
import type { ProjectCard } from '@/types/sanity'
import TextTitleSection from './sections/TextTitleSection'
import QuoteSection from './sections/QuoteSection'
import LogoCarouselSection from './sections/LogoCarouselSection'
import ImageCarouselSection from './sections/ImageCarouselSection'

type FullWidthMediaBlock = {
  _type: 'fullWidthMediaSection'
  _key: string
  mediaType?: string | null
  images?: SanityImageArrayItem[] | null
  video?: SanityBunnyVideo | null
  videoMobile?: SanityBunnyVideo | null
}

type HeroTextBlock = {
  _type: 'heroTextSection'
  _key: string
  newTitle?: InternationalizedPortableText | null
  newTitleMobile?: InternationalizedPortableText | null
  copy?: InternationalizedPortableText | null
  cta?: HeroTextSectionCta | null
  alignment?: 'left' | 'right' | null
}

type LandscapeMediaBlock = {
  _type: 'landscapeMediaSection'
  _key: string
  mediaType?: string | null
  image?: SanityImage | null
  imageMobile?: SanityImage | null
  video?: SanityBunnyVideo | null
  caption?: { _key: string; value?: string }[] | null
  alignment?: 'left' | 'right' | null
}

type PortraitMediaBlock = {
  _type: 'portraitMediaSection'
  _key: string
  mediaType?: string | null
  image?: SanityImage | null
  imageMobile?: SanityImage | null
  video?: SanityBunnyVideo | null
  caption?: { _key: string; value?: string }[] | null
  alignment?: 'left' | 'right' | null
}

type LandscapeMediaProjectInfoBlock = {
  _type: 'landscapeMediaProjectInfoSection'
  _key: string
  mediaType?: string | null
  image?: SanityImage | null
  imageMobile?: SanityImage | null
  video?: SanityBunnyVideo | null
  projectInfo?: ProjectInfoItem[] | null
}

type IntroWithMediaBlock = {
  _type: 'introWithMediaSection'
  _key: string
  mediaType?: 'image' | 'video' | null
  title?: InternationalizedValue | null
  image?: SanityImage | null
  imageMobile?: SanityImage | null
  video?: SanityBunnyVideo | null
  copy?: InternationalizedPortableText | null
  cta?: IntroWithMediaCta | null
  alignment?: 'left' | 'right' | null
}

type DualMediaBlock = {
  _type: 'dualMediaSection'
  _key: string
  mediaType1?: string | null
  image1?: SanityImage | null
  image1Mobile?: SanityImage | null
  video1?: SanityBunnyVideo | null
  mediaType2?: string | null
  image2?: SanityImage | null
  image2Mobile?: SanityImage | null
  video2?: SanityBunnyVideo | null
  alignment?: 'left' | 'right' | null
}

type ProjectCardBlock = {
  _type: 'projectCardSection'
  _key: string
  title?: { _key: string; value?: string }[] | null
  numberOfCards?: string | null
  card1?: ProjectCard
  card2?: ProjectCard
  card3?: ProjectCard
}

type TextTitleBlock = {
  _type: 'textTitleSection'
  _key: string
  title?: InternationalizedValue | null
  copy?: InternationalizedPortableText | null
}

type QuoteBlock = {
  _type: 'quoteSection'
  _key: string
  quote?: InternationalizedPortableText | null
  author?: InternationalizedValue | null
}

type LogoCarouselBlock = {
  _type: 'logoCarouselSection'
  _key: string
  title?: InternationalizedValue | null
  images?: SanityImageArrayItem[] | null
}

type ImageCarouselBlock = {
  _type: 'imageCarouselSection'
  _key: string
  images?: SanityImageArrayItem[] | null
}

type ContentBlock =
  | FullWidthMediaBlock
  | HeroTextBlock
  | LandscapeMediaBlock
  | PortraitMediaBlock
  | LandscapeMediaProjectInfoBlock
  | IntroWithMediaBlock
  | DualMediaBlock
  | ProjectCardBlock
  | TextTitleBlock
  | QuoteBlock
  | LogoCarouselBlock
  | ImageCarouselBlock

interface FlexibleContentProps {
  contentBlocks?: ContentBlock[] | null
  locale: string
}

export default function FlexibleContent({
  contentBlocks,
  locale,
}: FlexibleContentProps) {
  const blocks = contentBlocks ?? []
  if (blocks.length === 0) return null

  return (
    <>
      {blocks.map((block) => {
        if (block._type === 'fullWidthMediaSection') {
          return (
            <FullWidthMediaSection
              key={block._key}
              mediaType={block.mediaType ?? 'image'}
              images={block.images}
              video={block.video}
              videoMobile={block.videoMobile}
            />
          )
        }
        if (block._type === 'heroTextSection') {
          return (
            <HeroTextSection
              key={block._key}
              newTitle={block.newTitle}
              newTitleMobile={block.newTitleMobile}
              copy={block.copy}
              cta={block.cta}
              alignment={block.alignment ?? 'left'}
              locale={locale}
            />
          )
        }
        if (block._type === 'landscapeMediaSection') {
          const landscapeProps: LandscapeMediaSectionProps = {
            mediaType: block.mediaType ?? 'image',
            image: block.image,
            imageMobile: block.imageMobile,
            video: block.video,
            caption: block.caption,
            alignment: block.alignment ?? 'left',
            locale,
          }
          return <LandscapeMediaSection key={block._key} {...landscapeProps} />
        }
        if (block._type === 'portraitMediaSection') {
          const portraitProps: PortraitMediaSectionProps = {
            mediaType: block.mediaType ?? 'image',
            image: block.image,
            imageMobile: block.imageMobile,
            video: block.video,
            caption: block.caption,
            alignment: block.alignment ?? 'left',
            locale,
          }
          return <PortraitMediaSection key={block._key} {...portraitProps} />
        }
        if (block._type === 'landscapeMediaProjectInfoSection') {
          return (
            <LandscapeMediaProjectInfoSection
              key={block._key}
              mediaType={block.mediaType ?? 'image'}
              image={block.image}
              imageMobile={block.imageMobile}
              video={block.video}
              projectInfo={block.projectInfo}
              locale={locale}
            />
          )
        }
        if (block._type === 'introWithMediaSection') {
          return (
            <IntroWithMediaSection
              key={block._key}
              mediaType={block.mediaType ?? 'image'}
              title={block.title}
              image={block.image}
              imageMobile={block.imageMobile}
              video={block.video}
              copy={block.copy}
              cta={block.cta}
              alignment={block.alignment ?? 'left'}
              locale={locale}
            />
          )
        }
        if (block._type === 'dualMediaSection') {
          return (
            <DualMediaSection
              key={block._key}
              mediaType1={block.mediaType1 ?? 'image'}
              image1={block.image1}
              image1Mobile={block.image1Mobile}
              video1={block.video1}
              mediaType2={block.mediaType2 ?? 'image'}
              image2={block.image2}
              image2Mobile={block.image2Mobile}
              video2={block.video2}
              alignment={block.alignment ?? 'left'}
            />
          )
        }
        if (block._type === 'projectCardSection') {
          return (
            <ProjectCardSection
              key={block._key}
              title={block.title}
              numberOfCards={block.numberOfCards ?? '1'}
              card1={block.card1}
              card2={block.card2}
              card3={block.card3}
              locale={locale}
            />
          )
        }
        if (block._type === 'textTitleSection') {
          return (
            <TextTitleSection
              key={block._key}
              title={block.title}
              copy={block.copy}
              locale={locale}
            />
          )
        }
        if (block._type === 'quoteSection') {
          return (
            <QuoteSection
              key={block._key}
              quote={block.quote}
              author={block.author}
              locale={locale}
            />
          )
        }
        if (block._type === 'logoCarouselSection') {
          return (
            <LogoCarouselSection
              key={block._key}
              title={block.title}
              images={block.images}
              locale={locale}
            />
          )
        }
        if (block._type === 'imageCarouselSection') {
          return (
            <ImageCarouselSection
              key={block._key}
              images={block.images}
            />
          )
        }
        return null
      })}
    </>
  )
}
