import { defineType, defineField } from 'sanity'
import { TextIcon } from '@sanity/icons'

export default defineType({
  name: 'privacyPolicySection',
  title: 'Policy Section',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'richPortableText',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return {
        title: title || 'Untitled section',
        media: TextIcon,
      }
    },
  },
})
