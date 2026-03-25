import { ALL_FIELDS_GROUP, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

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
      name: 'footerMenu',
      title: 'Menu',
      type: 'links',
      fieldset: 'footer',
    }),
    defineField({
      name: 'footerText',
      title: 'Text',
      type: 'internationalizedArrayRichPortableText',
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
