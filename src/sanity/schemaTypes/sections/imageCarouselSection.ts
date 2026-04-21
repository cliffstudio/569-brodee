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
      description:
        'Each item has a desktop image and an optional mobile image (defaults to desktop if not set).',
      of: [{ type: 'imageWithMobile' }],
    }),
  ],
  preview: {
    select: {
      firstImage: 'images.0',
      firstImageDesktop: 'images.0.image',
    },
    prepare({ firstImage, firstImageDesktop }) {
      const title = 'Image Carousel'
      const media = firstImageDesktop ?? firstImage
      return { title, media }
    },
  },
})
