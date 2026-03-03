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
