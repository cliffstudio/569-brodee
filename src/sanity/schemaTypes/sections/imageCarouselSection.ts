import { defineType, defineField } from 'sanity'
import { imageSizeValidation } from '@/sanity/utils/imageValidation'

export default defineType({
  name: 'imageCarouselSection',
  title: 'Image Carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Each item can have an optional mobile image. Maximum file size per image: 500KB.',
      of: [
        { type: 'image', validation: imageSizeValidation },
        { type: 'imageWithMobile' },
      ],
    }),
  ],
  preview: {
    select: {
      images: 'images'
    },
    prepare({ images }) {
      const title = 'Image Carousel'
      const media = images?.[0]
      return { title, media }
    },
  },
})
