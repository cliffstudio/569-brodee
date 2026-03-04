'use client'

import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import {
  resolveInternationalized,
  resolveInternationalizedPortableText,
  type InternationalizedPortableText,
  type InternationalizedValue,
} from '@/lib/locale'

interface TextTitleSectionProps {
  title?: InternationalizedValue | null
  copy?: InternationalizedPortableText | null
  locale: string
}

export default function TextTitleSection({
  title,
  copy,
  locale,
}: TextTitleSectionProps) {
  const resolvedTitle = resolveInternationalized(title ?? undefined, locale)
  const resolvedCopy = resolveInternationalizedPortableText(copy ?? undefined, locale)

  if (!resolvedTitle && !resolvedCopy) return null

  return (
    <section className="title-text-section h-pad row-lg">
      <div className="col-6-12_lg">
        {resolvedTitle && <div className="heading uppercase out-of-view stage-1">{resolvedTitle}</div>}
      </div>

      <div className="col-6-12_lg">
        {resolvedCopy && (
          <div className="copy out-of-view stage-2">
            <PortableText value={resolvedCopy as any} components={portableTextComponents} />
          </div>
        )}
      </div>
    </section>
  )
}
