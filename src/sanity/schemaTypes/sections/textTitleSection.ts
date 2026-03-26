import { defineType, defineField } from 'sanity'
import { TextIcon } from '@sanity/icons'
import { createLayoutReferenceInput } from '@/sanity/components/LayoutReferenceInput'

const TextTitleLayoutReferenceInput = createLayoutReferenceInput({
  imagePath: '/layout-references/text-title.jpg',
  alt: 'Title and text section layout reference',
})

export default defineType({
  name: 'textTitleSection',
  title: 'Title & Text',
  type: 'object',
  fields: [
    defineField({
      name: 'layoutReference',
      title: 'Layout Reference',
      type: 'string',
      readOnly: true,
      initialValue: 'reference-only',
      components: {
        input: TextTitleLayoutReferenceInput,
      },
    }),
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
