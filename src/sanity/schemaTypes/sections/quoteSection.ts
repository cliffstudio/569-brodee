import { defineType, defineField } from 'sanity'
import { CommentIcon } from '@sanity/icons'

export default defineType({
  name: 'quoteSection',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'internationalizedArrayRichPortableText',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Quote', media: CommentIcon }
    },
  },
})
