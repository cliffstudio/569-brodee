import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons'
import SpacerHeightSliderInput from '@/sanity/components/SpacerHeightSliderInput'

const isValidSpacerStep = (value: number | undefined) =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6

export default defineType({
  name: 'spacerSection',
  title: 'Spacer',
  type: 'object',
  fields: [
    defineField({
      name: 'heightDesktop',
      title: 'Height (Desktop)',
      type: 'number',
      initialValue: 6,
      components: {
        input: SpacerHeightSliderInput,
      },
      validation: (Rule) =>
        Rule.required().custom((value) =>
          isValidSpacerStep(value)
            ? true
            : 'Spacer height must be a whole number between 0 and 6',
        ),
    }),
    defineField({
      name: 'heightMobile',
      title: 'Height (Mobile)',
      type: 'number',
      initialValue: 6,
      components: {
        input: SpacerHeightSliderInput,
      },
      validation: (Rule) =>
        Rule.required().custom((value) =>
          isValidSpacerStep(value)
            ? true
            : 'Spacer height must be a whole number between 0 and 6',
        ),
    }),
  ],
  preview: {
    select: {
      heightDesktop: 'heightDesktop',
      heightMobile: 'heightMobile',
    },
    prepare() {
      const title = 'Spacer'
      const media = BlockElementIcon
      return { title, media }
    },
  },
})
