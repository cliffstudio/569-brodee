import { defineType } from 'sanity'

export default defineType({
  name: 'flexibleContent',
  title: 'Content Blocks',
  type: 'array',
  of: [
    { type: 'fullWidthMediaSection', title: 'Full Width Media' },
    { type: 'heroTextSection', title: 'Hero Text' },
    { type: 'landscapeMediaSection', title: 'Landscape Media' },
    { type: 'landscapeMediaProjectInfoSection', title: 'Landscape Media & Project Info' },
    { type: 'introWithMediaSection', title: 'Text & Portrait Media' },
    { type: 'dualMediaSection', title: 'Double Portrait Media' },
    { type: 'doubleMediaWithTextSection', title: 'Double Media & Text' },
    { type: 'projectCardSection', title: 'Project Cards' },
    { type: 'linkCardSection', title: 'Link Cards' },
    { type: 'quoteSection', title: 'Quote' },
    { type: 'imageCarouselSection', title: 'Image Carousel' },
    { type: 'spacerSection', title: 'Spacer' },
  ],
  options: {
    sortable: true,
  }
})
