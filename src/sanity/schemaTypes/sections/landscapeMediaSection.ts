import { defineType, defineField } from 'sanity'
import { VideoIcon } from '@sanity/icons'
import { createLayoutReferenceInput } from '@/sanity/components/LayoutReferenceInput'

const LandscapeMediaLayoutReferenceInput = createLayoutReferenceInput({
  imagePath: '/layout-references/landscape-media.jpg',
  alt: 'Landscape media section layout reference',
})

export default defineType({
  name: 'landscapeMediaSection',
  title: 'Landscape Media',
  type: 'object',
  fields: [
    defineField({
      name: 'layoutReference',
      title: 'Layout Reference',
      type: 'string',
      readOnly: true,
      initialValue: 'reference-only',
      components: {
        input: LandscapeMediaLayoutReferenceInput,
      },
    }),
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
      const title = 'Landscape Media'
      const media = isVideo ? VideoIcon : image
      return { title, media }
    },
  },
})
