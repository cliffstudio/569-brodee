import { defineType, defineField } from 'sanity'
import { imageSizeValidation } from '@/sanity/utils/imageValidation'

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
      description: 'Maximum file size: 1MB.',
      validation: (Rule) => [
        Rule.required().error('Desktop image is required.'),
        imageSizeValidation(Rule),
      ],
    }),
    defineField({
      name: 'mobileImage',
      title: 'Image (Mobile)',
      type: 'image',
      description: 'Defaults to desktop image if not set. Maximum file size: 1MB.',
      validation: imageSizeValidation,
    }),
  ],
  preview: {
    select: { image: 'image' },
    prepare({ image }) {
      return { title: 'Image', media: image }
    },
  },
})
