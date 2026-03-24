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
      description: 'Each item can have an optional mobile image. Maximum file size per image: 1MB.',
      of: [
        { type: 'image', validation: imageSizeValidation },
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
