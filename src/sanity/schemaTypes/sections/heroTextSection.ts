import { defineType, defineField } from 'sanity'
import { TextIcon } from '@sanity/icons'
import { createLayoutReferenceInput } from '@/sanity/components/LayoutReferenceInput'

const HeroTextLayoutReferenceInput = createLayoutReferenceInput({
  imagePath: '/layout-references/hero-text.jpg',
  alt: 'Hero text section layout reference',
})

export default defineType({
  name: 'heroTextSection',
  title: 'Hero Text',
  type: 'object',
  fields: [
    defineField({
      name: 'layoutReference',
      title: 'Layout Reference',
      type: 'string',
      readOnly: true,
      initialValue: 'reference-only',
      components: {
        input: HeroTextLayoutReferenceInput,
      },
    }),
    defineField({
      name: 'title',
      title: 'Title (Desktop)',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'titleMobile',
      title: 'Title (Mobile)',
      type: 'internationalizedArrayString',
      description: 'Defaults to desktop title if not set.',
    }),
    defineField({
      name: 'newTitle',
      title: 'Title (Desktop)',
      type: 'internationalizedArrayRichPortableText',
    }),
    defineField({
      name: 'newTitleMobile',
      title: 'Title (Mobile)',
      type: 'internationalizedArrayRichPortableText',
      description: 'Defaults to desktop title if not set.',
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
      title: 'Copy Alignment',
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
    prepare() {
      return { title: 'Hero Text', media: TextIcon }
    },
  },
})
