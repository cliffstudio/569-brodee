import { defineType, defineField } from 'sanity'
import { VideoIcon } from '@sanity/icons'

export default defineType({
  name: 'introWithMediaSection',
  title: 'Intro with Media',
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
      title: 'Image (Desktop)',
      type: 'image',
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'imageMobile',
      title: 'Image (Mobile)',
      type: 'image',
      description: 'Optional. Defaults to desktop image if not set.',
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'bunnyVideo',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'copy',
      title: 'Copy',
      type: 'internationalizedArrayRichPortableText',
    }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'links',
      validation: (Rule) => Rule.max(1),
    }),
    defineField({
      name: 'alignment',
      title: 'Media Alignment',
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
      const title = isVideo ? 'Intro with Video' : 'Intro with Image'
      const media = isVideo ? VideoIcon : image
      return { title, media }
    },
  },
})
