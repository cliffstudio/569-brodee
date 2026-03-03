import { defineType, defineField } from 'sanity'
import { imageSizeValidation } from '@/sanity/utils/imageValidation'
import { VideoIcon } from '@sanity/icons'

export default defineType({
  name: 'landscapeMediaSection',
  title: 'Landscape Media',
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
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Maximum file size: 500KB.',
      validation: imageSizeValidation,
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'bunnyVideo',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      initialValue: 'left',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
  ],
  preview: {
    select: { 
      mediaType: 'mediaType',
      image: 'image'
    },
    prepare({ mediaType, image }) {
      const isVideo = mediaType === 'video'
      const title = isVideo ? 'Landscape Video' : 'Landscape Image'
      const media = isVideo ? VideoIcon : image
      return { title, media }
    },
  },
})
