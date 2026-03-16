'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ProjectCard } from '@/types/sanity'
import ResponsiveSanityImage from '@/components/ResponsiveSanityImage'
import ArrowRightIcon from '../icons/ArrowRightIcon'
import { resolveInternationalized, type InternationalizedValue } from '@/lib/locale'

gsap.registerPlugin(ScrollTrigger)

export interface ProjectCardSectionProps {
  title?: InternationalizedValue | null
  numberOfCards?: string | null
  card1?: ProjectCard
  card2?: ProjectCard
  card3?: ProjectCard
  locale?: string
}

function ProjectCardLink({
  card,
  columnClass,
}: {
  card: ProjectCard
  columnClass: string
}) {
  if (!card?.slug) return null
  return (
    <Link href={`/works/${card.slug}`} className={`${columnClass} project-card`}>
      {card.mainImage && (
        <div className="media-wrap">
          <ResponsiveSanityImage
            desktop={card.mainImage}
            mobile={card.mainImageMobile}
            className="lazy full-bleed-image"
          />
          <div className="media-overlay" />
        </div>
      )}
      {card.title && (
        <div className="cta-link">
          {card.title}
          <ArrowRightIcon />
        </div>
      )}
    </Link>
  )
}

export default function ProjectCardSection({
  title,
  numberOfCards = '1',
  card1,
  card2,
  card3,
  locale = 'en',
}: ProjectCardSectionProps) {
  const resolvedTitle = resolveInternationalized(title ?? undefined, locale)
  const n = String(numberOfCards ?? '1')

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)')
    if (!mq.matches) return

    const sectionSelector = '.project-card-section.cards-1'
    const sectionEl = document.querySelector(sectionSelector)
    const contentWrap = sectionEl?.querySelector('.content-wrap')
    if (!sectionEl || !contentWrap) return

    const sectionStyle = getComputedStyle(sectionEl)
    const paddingTop = parseFloat(sectionStyle.paddingTop || '75')
    const paddingBottom = parseFloat(sectionStyle.paddingBottom || '75')
    const contentWrapHeight = contentWrap.getBoundingClientRect().height
    const endOffset = paddingBottom + contentWrapHeight

    const st = ScrollTrigger.create({
      trigger: contentWrap,
      pin: contentWrap,
      start: `top top+=${paddingTop}`,
      endTrigger: sectionSelector,
      end: `bottom-=${endOffset} top+=${endOffset}`,
      pinSpacing: false,
      invalidateOnRefresh: true,
    })

    const onMediaChange = (e: MediaQueryListEvent) => {
      if (!e.matches) st.kill()
    }
    mq.addEventListener('change', onMediaChange)
    return () => {
      mq.removeEventListener('change', onMediaChange)
      st.kill()
    }
  }, [])

  if (n === '1' && card1) {
    return (
      <section className="project-card-section h-pad cards-1">
        {card1.mainImage && (
          <ResponsiveSanityImage
            desktop={card1.mainImage}
            mobile={card1.mainImageMobile}
            className="lazy full-bleed-image"
          />
        )}

        {(resolvedTitle || card1.title) && (
          <div className="content-wrap h-pad">
            {resolvedTitle && <div className="header uppercase out-of-opacity">{resolvedTitle}</div>}
            <Link href={`/works/${card1.slug ?? ''}`}>
              {card1.title && (
                <div className="cta-link out-of-opacity">
                  {card1.title}
                  <ArrowRightIcon />
                </div>
              )}
            </Link>
          </div>
        )}
      </section>
    )
  }

  if (n === '2' || n === '3') {
    const cards = [card1, card2, ...(n === '3' ? [card3] : [])].filter(
      (c): c is ProjectCard => c != null && !!c.slug
    )
    const columnClass = n === '2' ? 'col-6-12_lg' : 'col-4-12_lg'

    return (
      <section className={`project-card-section h-pad cards-${n}`}>
        {resolvedTitle && <div className="header uppercase out-of-opacity">{resolvedTitle}</div>}
        <div className="row-lg out-of-opacity">
          {cards.map((card) => (
            <ProjectCardLink
              key={card!.slug}
              card={card!}
              columnClass={columnClass}
            />
          ))}
        </div>
      </section>
    )
  }

  return null
}