import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'projectCardSection',
  title: 'Project Card',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      description: 'Will be shown on the left of the cards.',
    }),
    defineField({
      name: 'numberOfCards',
      title: 'Number of Cards',
      type: 'string',
      initialValue: '1',
      options: { 
        list: [
          { title: '1', value: '1' },
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
      type: 'reference',
      to: [{ type: 'caseStudy' }],
    }),
    defineField({
      name: 'card2',
      title: 'Card 2',
      type: 'reference',
      to: [{ type: 'caseStudy' }],
      hidden: ({ parent }) => parent?.numberOfCards !== '2' && parent?.numberOfCards !== '3',
    }),
    defineField({
      name: 'card3',
      title: 'Card 3',
      type: 'reference',
      to: [{ type: 'caseStudy' }],
      hidden: ({ parent }) => parent?.numberOfCards !== '3',
    }),
  ],
  preview: {
    select: {
      numberOfCards: 'numberOfCards',
      card1: 'card1',
      card1Image: 'card1.mainImage',
    },
    prepare({ numberOfCards, card1Image }) {
      const title = 'Project Card'
      const media = card1Image
      return { title, media }
    },
  },
})
