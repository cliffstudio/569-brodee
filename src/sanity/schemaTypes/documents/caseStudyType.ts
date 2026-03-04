import { defineType, defineField, ALL_FIELDS_GROUP } from 'sanity'
import { DocumentsIcon } from '@sanity/icons'
import { imageSizeValidation } from '@/sanity/utils/imageValidation'

export const caseStudyType = defineType({
  name: 'caseStudy',
  title: 'Projects',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
      description: 'URL path for this project (e.g. my-project → /works/my-project)',
    }),
    defineField({
      name: 'backgroundColour',
      title: 'Background Colour',
      type: 'string',
      options: {
        list: [
          { title: 'Black', value: 'black' },
          { title: 'Charcoal', value: 'charcoal' },
          { title: 'Espresso', value: 'espresso' },
          { title: 'Walnut', value: 'walnut' },
          { title: 'Fern', value: 'fern' },
          { title: 'Terracotta', value: 'terracotta' },
          { title: 'Birch', value: 'birch' },
          { title: 'Sage', value: 'sage' },
          { title: 'Chalk', value: 'chalk' },
          { title: 'White', value: 'white' },
        ],
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image (Desktop)',
      type: 'image',
      description: 'Maximum file size: 500KB. Used for the project thumbnail.',
      validation: imageSizeValidation,
    }),
    defineField({
      name: 'mainImageMobile',
      title: 'Main Image (Mobile)',
      type: 'image',
      description: 'Optional. Defaults to main image if not set. Maximum file size: 500KB.',
      validation: imageSizeValidation,
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Blocks',
      type: 'flexibleContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      mainImage: 'mainImage',
    },
    prepare({ title, mainImage }) {
      return {
        title: title || 'Untitled Project',
        media: mainImage,
      }
    },
  },
  orderings: [
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
