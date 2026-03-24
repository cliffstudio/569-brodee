import { defineType, defineField } from 'sanity'
import { imageSizeValidation } from '@/sanity/utils/imageValidation'
import { VideoIcon } from '@sanity/icons'

export default defineType({
  name: 'dualMediaSection',
  title: 'Dual Media',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType1',
      title: 'Small Media Type',
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
      name: 'image1',
      title: 'Small Image (Desktop)',
      type: 'image',
      description: 'Maximum file size: 1MB.',
      validation: imageSizeValidation,
      hidden: ({ parent }) => parent?.mediaType1 !== 'image',
    }),
    defineField({
      name: 'image1Mobile',
      title: 'Small Image (Mobile)',
      type: 'image',
      description: 'Optional. Defaults to small image if not set. Maximum file size: 1MB.',
      validation: imageSizeValidation,
      hidden: ({ parent }) => parent?.mediaType1 !== 'image',
    }),
    defineField({
      name: 'video1',
      title: 'Small Video',
      type: 'bunnyVideo',
      hidden: ({ parent }) => parent?.mediaType1 !== 'video',
    }),
    defineField({
      name: 'mediaType2',
      title: 'Large Media Type',
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
      name: 'image2',
      title: 'Large Image (Desktop)',
      type: 'image',
      description: 'Maximum file size: 1MB.',
      validation: imageSizeValidation,
      hidden: ({ parent }) => parent?.mediaType2 !== 'image',
    }),
    defineField({
      name: 'image2Mobile',
      title: 'Large Image (Mobile)',
      type: 'image',
      description: 'Optional. Defaults to large image if not set. Maximum file size: 1MB.',
      validation: imageSizeValidation,
      hidden: ({ parent }) => parent?.mediaType2 !== 'image',
    }),
    defineField({
      name: 'video2',
      title: 'Large Video',
      type: 'bunnyVideo',
      hidden: ({ parent }) => parent?.mediaType2 !== 'video',
    }),
    defineField({
      name: 'alignment',
      title: 'Small Media Alignment',
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
      mediaType1: 'mediaType1',
      image1: 'image1',
    },
    prepare({ mediaType1, image1 }) {
      const isVideo = mediaType1 === 'video'
      const title = 'Dual Media'
      const media = isVideo ? VideoIcon : image1
      return { title, media }
    },
  },
})
