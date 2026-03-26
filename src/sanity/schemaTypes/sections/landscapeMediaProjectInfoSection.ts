import { defineType, defineField, defineArrayMember } from 'sanity'
import { VideoIcon, TextIcon } from '@sanity/icons'
import { createLayoutReferenceInput } from '@/sanity/components/LayoutReferenceInput';

const LandscapeMediaProjectInfoLayoutReferenceInput = createLayoutReferenceInput({
  imagePath: '/layout-references/landscape-media-project-info.jpg',
  alt: 'Landscape media and project info section layout reference',
})

export default defineType({
  name: 'landscapeMediaProjectInfoSection',
  title: 'Landscape Media & Project Info',
  type: 'object',
  fields: [
    defineField({
      name: 'layoutReference',
      title: 'Layout Reference',
      type: 'string',
      readOnly: true,
      initialValue: 'reference-only',
      components: {
        input: LandscapeMediaProjectInfoLayoutReferenceInput,
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
      const title = 'Landscape Media & Project Info'
      const media = isVideo ? VideoIcon : image
      return { title, media }
    },
  },
})
