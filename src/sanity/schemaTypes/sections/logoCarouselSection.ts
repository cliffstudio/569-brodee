import { defineType, defineField } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import { imageSizeValidation } from '@/sanity/utils/imageValidation'

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
      description: 'Maximum file size per image: 500KB.',
      of: [
        {
          type: 'image',
          validation: imageSizeValidation,
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Logo Carousel', media: ImagesIcon }
    },
  },
})
