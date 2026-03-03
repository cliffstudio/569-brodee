import type { StructureResolver } from 'sanity/structure'
import { CogIcon } from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Brodee')
    .items([
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('caseStudy').title('Projects'),
      S.divider(),
      // Site Settings as a singleton – opens the single document directly, no "+" or list
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings'),
        ),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          item.getId() !== 'page' &&
          item.getId() !== 'caseStudy' &&
          item.getId() !== 'siteSettings',
      ),
    ])
