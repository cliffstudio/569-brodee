import { defineField } from 'sanity'
import { CogIcon, ArrowTopRightIcon } from '@sanity/icons'

export const siteSettingsType = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fieldsets: [
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'header',
      title: 'Header',
    },
    {
      name: 'footer',
      title: 'Footer',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      fieldset: 'seo',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      fieldset: 'seo',
    }),
    defineField({
      name: 'socialimage',
      title: 'Social Image (Desktop)',
      type: 'image',
      options: { hotspot: true },
      description: 'Recommended size: 1200x630px.',
      fieldset: 'seo',
    }),
    defineField({
      title: 'Menu',
      name: 'headerMenu',
      type: 'links',
      fieldset: 'header',
    }),
    defineField({
      name: 'showLanguageSwitcher',
      title: 'Show Language Switcher',
      type: 'boolean',
      initialValue: false,
      fieldset: 'header',
    }),
    defineField({
      name: 'footer',
      title: 'Title',
      type: 'internationalizedArrayString',
      fieldset: 'footer',
    }),
    defineField({
      name: 'footerText',
      title: 'Text',
      type: 'internationalizedArrayRichPortableText',
      fieldset: 'footer',
    }),
    defineField({
      name: 'footerMenu',
      title: 'Social Menu',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerMenuItem',
          title: 'Menu Item',
          fields: [
            defineField({
              name: 'icon',
              title: 'SVG Icon',
              type: 'image',
              description: 'Only SVG files are allowed for this icon field.',
              options: {
                accept: '.svg,image/svg+xml',
              },
              validation: (Rule) =>
                Rule.custom((value) => {
                  const assetRef = value?.asset?._ref
                  if (!assetRef) return true
                  return assetRef.endsWith('-svg')
                    ? true
                    : 'Only SVG files are allowed.'
                }),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
            }),
          ],
          preview: {
            select: {
              linkHref: 'link.href',
            },
            prepare(selection) {
              const { linkHref } = selection
              return {
                title: linkHref || 'Untitled social link',
                media: ArrowTopRightIcon,
              }
            },
          },
        },
      ],
      fieldset: 'footer',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        media: CogIcon,
      }
    },
  },
}
