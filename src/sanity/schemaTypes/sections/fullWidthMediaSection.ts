import { defineType, defineField } from 'sanity'
import { VideoIcon } from '@sanity/icons'

export default defineType({
  name: 'fullWidthMediaSection',
  title: 'Full Width Media',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      initialValue: 'image',
      options: { 
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'One image for full-width hero; multiple for carousel. Each item has a desktop image and an optional mobile image (defaults to desktop if not set). Maximum file size per image: 500KB.',
      of: [{ type: 'imageWithMobile' }],
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video (Desktop)',
      type: 'bunnyVideo',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoMobile',
      title: 'Video (Mobile)',
      type: 'bunnyVideo',
      description: 'Defaults to desktop video if not set.',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
  ],
  preview: {
    select: {
      mediaType: 'mediaType',
      firstImage: 'images.0',
      firstImageDesktop: 'images.0.image',
    },
    prepare({ mediaType, firstImage, firstImageDesktop }) {
      const isVideo = mediaType === 'video'
      const title = isVideo ? 'Full Width Video' : 'Full Width Image'
      const media = isVideo ? VideoIcon : firstImageDesktop ?? firstImage
      return { title, media }
    },
  },
})
