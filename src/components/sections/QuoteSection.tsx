'use client'

import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import {
  resolveInternationalized,
  resolveInternationalizedPortableText,
  type InternationalizedPortableText,
  type InternationalizedValue,
} from '@/lib/locale'

interface QuoteSectionProps {
  quote?: InternationalizedPortableText | null
  author?: InternationalizedValue | null
  locale: string
}

export default function QuoteSection({
  quote,
  author,
  locale,
}: QuoteSectionProps) {
  const resolvedQuote = resolveInternationalizedPortableText(quote ?? undefined, locale)
  const resolvedAuthor = resolveInternationalized(author ?? undefined, locale)

  if (!resolvedQuote && !resolvedAuthor) return null

  return (
    <section className="quote-section h-pad">
      {resolvedQuote && (
        <h2 className="quote out-of-view">
          <PortableText value={resolvedQuote as any} components={portableTextComponents} />
        </h2>
      )}
      {resolvedAuthor && (
        <div className="author uppercase out-of-view">{resolvedAuthor}</div>
      )}
    </section>
  )
}
