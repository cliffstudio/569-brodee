import { createLayoutReferenceInput } from '@/sanity/components/LayoutReferenceInput';
import { defineType, defineField } from 'sanity'

const LinkCardLayoutReferenceInput = createLayoutReferenceInput({
  imagePath: '/layout-references/link-cards.jpg',
  alt: 'Link card section layout reference',
})

export default defineType({
  name: 'linkCardSection',
  title: 'Link Cards',
  type: 'object',
  fields: [
    defineField({
      name: 'layoutReference',
      title: 'Layout Reference',
      type: 'string',
      readOnly: true,
      initialValue: 'reference-only',
      components: {
        input: LinkCardLayoutReferenceInput,
      },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'numberOfCards',
      title: 'Number of Cards',
      type: 'string',
      initialValue: '2',
      options: { 
        list: [
          { title: '2', value: '2' },
          { title: '3', value: '3' },
        ], 
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'card1',
      title: 'Card 1',
      type: 'object',
      validation: (Rule) =>
        Rule.custom((value) => {
          const card = value as { link?: { label?: string; href?: string } } | undefined
          if (!card?.link?.label?.trim()) return 'Card 1 link label is required'
          if (!card?.link?.href) return 'Card 1 link URL is required'
          return true
        }),
      fields: [
        defineField({
          name: 'link',
          title: 'Link',
          type: 'object',
          options: {
            collapsible: false,
            collapsed: false,
          },
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
            }),
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
            }),
            defineField({
              name: 'openInNewTab',
              type: 'boolean',
              title: 'Open in new tab',
              initialValue: false,
            }),
          ],
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'card2',
      title: 'Card 2',
      type: 'object',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const section = context.parent as { numberOfCards?: string | number } | undefined
          const card = value as { link?: { label?: string; href?: string } } | undefined
          const numberOfCards = String(section?.numberOfCards ?? '2')
          if (numberOfCards !== '2' && numberOfCards !== '3') return 'Number of cards must be 2 or 3'
          if (!card?.link?.label?.trim()) return 'Card 2 link label is required'
          if (!card?.link?.href) return 'Card 2 link URL is required'
          return true
        }),
      fields: [
        defineField({
          name: 'link',
          title: 'Link',
          type: 'object',
          options: {
            collapsible: false,
            collapsed: false,
          },
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
            }),
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
            }),
            defineField({
              name: 'openInNewTab',
              type: 'boolean',
              title: 'Open in new tab',
              initialValue: false,
            }),
          ],
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'card3',
      title: 'Card 3',
      type: 'object',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const section = context.parent as { numberOfCards?: string | number } | undefined
          const card = value as { link?: { label?: string; href?: string } } | undefined
          const numberOfCards = String(section?.numberOfCards ?? '2')
          if (numberOfCards !== '3') return true
          if (!card?.link?.label?.trim()) return 'Card 3 link label is required'
          if (!card?.link?.href) return 'Card 3 link URL is required'
          return true
        }),
      fields: [
        defineField({
          name: 'link',
          title: 'Link',
          type: 'object',
          options: {
            collapsible: false,
            collapsed: false,
          },
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
            }),
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
            }),
            defineField({
              name: 'openInNewTab',
              type: 'boolean',
              title: 'Open in new tab',
              initialValue: false,
            }),
          ],
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
      hidden: ({ parent }) => parent?.numberOfCards !== '3',
    }),
  ],
  preview: {
    select: {
      card1Image: 'card1.image',
    },
    prepare({ card1Image }) {
      const title = 'Link Cards'
      const media = card1Image
      return { title, media }
    },
  },
})
