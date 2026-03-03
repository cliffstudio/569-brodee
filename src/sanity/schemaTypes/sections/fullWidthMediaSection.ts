import { defineType, defineField } from 'sanity'
import { VideoIcon } from '@sanity/icons'
import { imageSizeValidation } from '@/sanity/utils/imageValidation'

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
      description: 'One image for full-width hero; multiple for carousel. Maximum file size per image: 500KB.',
      of: [
        {
          type: 'image',
          validation: imageSizeValidation,
        },
      ],
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'bunnyVideo',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
  ],
  preview: {
    select: {
      mediaType: 'mediaType', 
      images: 'images'
    },
    prepare({ mediaType, images }) {
      const isVideo = mediaType === 'video'
      const title = isVideo ? 'Full Width Video' : 'Full Width Image'
      const media = isVideo ? VideoIcon : images?.[0]
      return { title, media }
    },
  },
})
