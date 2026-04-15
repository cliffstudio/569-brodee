'use client'

import Link from 'next/link'
import type { SanityImage } from '@/types/sanity'
import ResponsiveSanityImage from '@/components/ResponsiveSanityImage'
import ArrowRightIcon from '../icons/ArrowRightIcon'
import { resolveInternationalized, type InternationalizedValue } from '@/lib/locale'

type LinkCardLink = {
  label?: string | null
  href?: string | null
  openInNewTab?: boolean | null
}

type LinkCard = {
  link?: LinkCardLink | null
  image?: SanityImage | null
}

export interface LinkCardSectionProps {
  title?: InternationalizedValue | null
  numberOfCards?: string | null
  card1?: LinkCard | null
  card2?: LinkCard | null
  card3?: LinkCard | null
  locale?: string
}

function LinkCardItem({
  card,
  columnClass,
  sectionTitle,
}: {
  card: LinkCard
  columnClass: string
  sectionTitle?: string | null
}) {
  const href = card?.link?.href?.trim()
  if (!href) return null

  const label = card.link?.label?.trim() || href
  const openInNewTab = !!card.link?.openInNewTab

  return (
    <Link
      href={href}
      className={`${columnClass} project-card`}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
    >
      {card.image && (
        <div className="media-wrap">
          <ResponsiveSanityImage desktop={card.image} mobile={card.image} className="lazy full-bleed-image" />
          <div className="media-overlay" />
        </div>
      )}
      {(sectionTitle || label) && (
        <div className="cta-link-wrap">
          {sectionTitle && <div className="cta-link">{sectionTitle}</div>}
          <div className="cta-link">
            {label}
            <ArrowRightIcon />
          </div>
        </div>
      )}
    </Link>
  )
}

export default function LinkCardSection({
  title,
  numberOfCards = '2',
  card1,
  card2,
  card3,
  locale = 'en',
}: LinkCardSectionProps) {
  const resolvedTitle = resolveInternationalized(title ?? undefined, locale)
  const n = String(numberOfCards ?? '2')
  const cards = [card1, card2, ...(n === '3' ? [card3] : [])].filter((c): c is LinkCard => c != null)
  const columnClass = n === '3' ? 'col-4-12_lg' : 'col-6-12_lg'

  if (cards.length === 0) return null

  return (
    <section className={`link-card-section h-pad cards-${n}`}>
      {resolvedTitle && <div className="header out-of-opacity">{resolvedTitle}</div>}

      <div className="row-lg out-of-opacity">
        {cards.map((card, index) => (
          <LinkCardItem
            key={`${card.link?.href ?? 'card'}-${index}`}
            card={card}
            columnClass={columnClass}
            sectionTitle={resolvedTitle}
          />
        ))}
      </div>
    </section>
  )
}
