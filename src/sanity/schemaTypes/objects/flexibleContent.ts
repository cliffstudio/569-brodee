import { defineType } from 'sanity'

export default defineType({
  name: 'flexibleContent',
  title: 'Content Blocks',
  type: 'array',
  of: [
    { type: 'fullWidthMediaSection', title: 'Full Width Media' },
    { type: 'heroTextSection', title: 'Hero Text' },
    { type: 'landscapeMediaSection', title: 'Landscape Media' },
    { type: 'portraitMediaSection', title: 'Portrait Media' },
    { type: 'landscapeMediaProjectInfoSection', title: 'Landscape Media & Project Info' },
    { type: 'introWithMediaSection', title: 'Intro with Media' },
    { type: 'dualMediaSection', title: 'Dual Media' },
    { type: 'projectCardSection', title: 'Project Cards' },
    { type: 'textTitleSection', title: 'Title & Text' },
    { type: 'quoteSection', title: 'Quote' },
    { type: 'logoCarouselSection', title: 'Logo Carousel' },
    { type: 'imageCarouselSection', title: 'Image Carousel' },
  ],
  options: {
    sortable: true,
  }
})
