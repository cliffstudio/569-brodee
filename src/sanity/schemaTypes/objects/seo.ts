import { defineType, defineField } from 'sanity'

export default defineType({
  title: 'SEO',
  name: 'seo',
  type: 'object',
  fields: [
    defineField({
      type: 'string',
      title: 'Title',
      name: 'metaTitle',
      description: 'Title used for search engines and browsers.',
      validation: Rule => Rule.max(50).warning('Longer titles may be truncated by search engines')
    }),
    defineField({
      type: 'text',
      title: 'Description',
      name: 'metaDescription',
      rows: 3,
      description: 'Description used for search engines.',
      validation: Rule => Rule.max(150).warning('Longer descriptions may be truncated by search engines')
    }),
    defineField({
      name: 'socialimage',
      title: 'Social Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Image used for social media previews. Recommended size: 1200×630px.',
    }),
  ]
})