import { defineType, defineField } from 'sanity'
import { CommentIcon } from '@sanity/icons'
import { createLayoutReferenceInput } from '@/sanity/components/LayoutReferenceInput'

const QuoteLayoutReferenceInput = createLayoutReferenceInput({
  imagePath: '/layout-references/quote.jpg',
  alt: 'Quote section layout reference',
})

export default defineType({
  name: 'quoteSection',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'layoutReference',
      title: 'Layout Reference',
      type: 'string',
      readOnly: true,
      initialValue: 'reference-only',
      components: {
        input: QuoteLayoutReferenceInput,
      },
    }),
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
