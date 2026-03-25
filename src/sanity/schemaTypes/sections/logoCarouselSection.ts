import { defineType, defineField } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

export default defineType({
  name: 'logoCarouselSection',
  title: 'Logo Carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Each item can have an optional mobile image.',
      of: [
        { type: 'image' },
        { type: 'imageWithMobile' },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Logo Carousel', media: ImagesIcon }
    },
  },
})
