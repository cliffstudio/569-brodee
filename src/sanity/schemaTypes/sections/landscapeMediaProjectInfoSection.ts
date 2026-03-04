import { defineType, defineField, defineArrayMember } from 'sanity'
import { imageSizeValidation } from '@/sanity/utils/imageValidation'
import { VideoIcon, TextIcon } from '@sanity/icons'

export default defineType({
  name: 'landscapeMediaProjectInfoSection',
  title: 'Landscape Media & Project Info',
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
      description: 'Maximum file size: 500KB.',
      validation: imageSizeValidation,
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'imageMobile',
      title: 'Image (Mobile)',
      type: 'image',
      description: 'Optional. Defaults to desktop image if not set. Maximum file size: 500KB.',
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
      name: 'projectInfo',
      title: 'Project Info',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'copy',
              title: 'Copy',
              type: 'internationalizedArrayRichPortableText',
            }),
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }: { title?: { _key: string; value?: string }[] }) {
              const en = Array.isArray(title) ? title.find((t) => t._key === 'en') : null
              const first = Array.isArray(title) ? title[0] : null
              const displayTitle = en?.value ?? first?.value ?? 'Untitled'
              return { title: displayTitle, media: TextIcon }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { 
      mediaType: 'mediaType',
      image: 'image'
    },
    prepare({ mediaType, image }) {
      const isVideo = mediaType === 'video'
      const title = isVideo ? 'Landscape Video & Project Info' : 'Landscape Image & Project Info'
      const media = isVideo ? VideoIcon : image
      return { title, media }
    },
  },
})
