import { defineType, defineField } from 'sanity'

/** Image with optional mobile variant. Used in image arrays; desktop image is used for mobile when mobile is not set. */
export const imageWithMobileType = defineType({
  name: 'imageWithMobile',
  title: 'Image (with optional mobile)',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image (Desktop)',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => [
        Rule.required().error('Desktop image is required.'),
      ],
    }),
    defineField({
      name: 'mobileImage',
      title: 'Image (Mobile)',
      type: 'image',
      options: { hotspot: true },
      description: 'Defaults to desktop image if not set.',
    }),
  ],
  preview: {
    select: { image: 'image' },
    prepare({ image }) {
      return { title: 'Image', media: image }
    },
  },
})
