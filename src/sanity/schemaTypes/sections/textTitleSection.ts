import { defineType, defineField } from 'sanity'
import { TextIcon } from '@sanity/icons'

export default defineType({
  name: 'textTitleSection',
  title: 'Title & Text',
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
    prepare() {
      return { title: 'Title & Text', media: TextIcon }
    },
  },
})
