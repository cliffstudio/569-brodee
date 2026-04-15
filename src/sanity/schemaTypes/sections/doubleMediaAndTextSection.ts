import { defineType, defineField } from 'sanity'
import { VideoIcon } from '@sanity/icons'
import { createLayoutReferenceInput } from '@/sanity/components/LayoutReferenceInput'

const DoubleMediaAndTextLayoutReferenceInput = createLayoutReferenceInput({
  imagePath: '/layout-references/double-media-and-text.jpg',
  alt: 'Double media and text section layout reference',
})

export default defineType({
  name: 'doubleMediaWithTextSection',
  title: 'Double Media & Text',
  type: 'object',
  fields: [
    defineField({
      name: 'layoutReference',
      title: 'Layout Reference',
      type: 'string',
      readOnly: true,
      initialValue: 'reference-only',
      components: {
        input: DoubleMediaAndTextLayoutReferenceInput,
      },
    }),
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
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType1 !== 'image',
    }),
    defineField({
      name: 'image1Mobile',
      title: 'Small Image (Mobile)',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional. Defaults to desktop image if not set.',
      hidden: ({ parent }) => parent?.mediaType1 !== 'image',
    }),
    defineField({
      name: 'video1',
      title: 'Small Video',
      type: 'bunnyVideo',
      hidden: ({ parent }) => parent?.mediaType1 !== 'video',
    }),
    defineField({
      name: 'title1',
      title: 'Small Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'copy1',
      title: 'Small Copy',
      type: 'internationalizedArrayRichPortableText',
    }),
    defineField({
      name: 'cta1',
      title: 'Small CTA',
      type: 'links',
      validation: (Rule) => Rule.max(1),
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
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType2 !== 'image',
    }),
    defineField({
      name: 'image2Mobile',
      title: 'Large Image (Mobile)',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional. Defaults to desktop image if not set.',
      hidden: ({ parent }) => parent?.mediaType2 !== 'image',
    }),
    defineField({
      name: 'video2',
      title: 'Large Video',
      type: 'bunnyVideo',
      hidden: ({ parent }) => parent?.mediaType2 !== 'video',
    }),
    defineField({
      name: 'title2',
      title: 'Large Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'copy2',
      title: 'Large Copy',
      type: 'internationalizedArrayRichPortableText',
    }),
    defineField({
      name: 'cta',
      title: 'Large CTA',
      type: 'links',
      validation: (Rule) => Rule.max(1),
    }),
  ],
  preview: {
    select: {
      mediaType1: 'mediaType1',
      image1: 'image1',
    },
    prepare({ mediaType1, image1 }) {
      const isVideo = mediaType1 === 'video'
      const title = 'Double Media & Text'
      const media = isVideo ? VideoIcon : image1
      return { title, media }
    },
  },
})
