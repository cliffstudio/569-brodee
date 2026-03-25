import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'imageCarouselSection',
  title: 'Image Carousel',
  type: 'object',
  fields: [
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
