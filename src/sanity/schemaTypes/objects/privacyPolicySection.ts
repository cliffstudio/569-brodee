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
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayRichPortableText',
    }),
  ],
  preview: {
    select: { title: 'title.0.value' },
    prepare({ title }) {
      return {
        title: title || 'Untitled section',
        media: TextIcon,
      }
    },
  },
})
