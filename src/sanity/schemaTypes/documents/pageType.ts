import { defineType, defineField, ALL_FIELDS_GROUP } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {
      ...ALL_FIELDS_GROUP,
      hidden: true,
    },
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path for this page (e.g. my-page → /my-page). Leave empty for the homepage.',
      options: {
        source: 'title',
      },
      group: 'content',
    }),
    defineField({
      name: 'template',
      title: 'Page Template',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Policy', value: 'policy' },
        ],
      },
      initialValue: 'default',
      group: 'content',
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
      group: 'content',
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Blocks',
      type: 'flexibleContent',
      hidden: ({ document }) => (document?.template as string) === 'policy',
      group: 'content',
    }),
    defineField({
      name: 'policySections',
      title: 'Content Blocks',
      type: 'array',
      of: [{ type: 'privacyPolicySection' }],
      hidden: ({ document }) => (document?.template as string) !== 'policy',
      group: 'content',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Optional. Falls back to Site Settings SEO values when empty.',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Untitled Page',
      }
    },
  },
})
