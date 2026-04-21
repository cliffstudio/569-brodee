// /schemas/objects/links.ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { LinkIcon, ArrowTopRightIcon, DocumentIcon } from '@sanity/icons'
import { PAGE_REFERENCES } from '@/sanity/lib/constants'

/** Used by portable text block annotations (inline link marks) */
export const linkAnnotation = defineType({
  type: 'object',
  name: 'link',
  title: 'Link',
  fields: [
    defineField({
      name: 'href',
      type: 'url',
      title: 'URL',
      validation: (Rule) =>
        Rule.uri({ scheme: ['tel', 'mailto', 'http', 'https'] }).required(),
    }),
    defineField({
      name: 'openInNewTab',
      type: 'boolean',
      title: 'Open in new tab',
      initialValue: false,
    }),
  ],
})

const linkArrayMembers = [
  defineArrayMember({
    type: 'object',
    title: 'Internal',
    name: 'internal',
    fields: [
      defineField({
        type: 'reference',
        title: 'Page',
        name: 'page',
        to: PAGE_REFERENCES,
      }),
      defineField({
        type: 'internationalizedArrayString',
        title: 'Label',
        name: 'labelI18n',
        description: 'Optional label override. Falls back to page title.',
      }),
    ],
    preview: {
      select: {
        pageTitle: 'page.title',
        label: 'labelI18n.0.value',
      },
      prepare(selection) {
        const { pageTitle, label } = selection
        return {
          title: label || pageTitle,
          subtitle: label ? `Internal (${pageTitle})` : 'Internal',
          media: LinkIcon,
        }
      },
    },
  }),
  defineArrayMember({
    type: 'object',
    title: 'External',
    name: 'external',
    fields: [
      defineField({
        type: 'internationalizedArrayString',
        title: 'Label',
        name: 'labelI18n',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        type: 'url',
        title: 'URL',
        name: 'url',
        validation: (Rule) =>
          Rule.uri({ scheme: ['tel', 'mailto', 'http', 'https'] }).required(),
      }),
    ],
    preview: {
      select: {
        label: 'labelI18n.0.value',
      },
      prepare(selection) {
        const { label } = selection
        return { title: label, subtitle: 'External', media: ArrowTopRightIcon }
      },
    },
  }),
  defineArrayMember({
    type: 'object',
    title: 'File',
    name: 'fileUpload',
    fields: [
      defineField({
        type: 'internationalizedArrayString',
        title: 'Label',
        name: 'labelI18n',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        type: 'file',
        title: 'File',
        name: 'file',
        validation: (Rule) => Rule.required(),
      }),
    ],
    preview: {
      select: {
        label: 'labelI18n.0.value',
      },
      prepare(selection) {
        const { label } = selection
        return { title: label, subtitle: 'File', media: DocumentIcon }
      },
    },
  }),
]

/** Array of internal/external/file links; use with max(1) for a single link (e.g. button) */
export const linksArray = defineType({
  type: 'array',
  title: 'Links',
  name: 'links',
  validation: (Rule) => Rule.unique(),
  of: linkArrayMembers,
})

const linkTypes = [linkAnnotation, linksArray]
export default linkTypes