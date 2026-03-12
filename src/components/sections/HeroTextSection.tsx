'use client'

import { useEffect, useRef } from 'react'
import { PortableText } from '@portabletext/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { portableTextComponents } from '@/components/PortableTextComponents'
import {
  resolveInternationalized,
  resolveInternationalizedPortableText,
  type InternationalizedPortableText,
  type InternationalizedValue,
} from '@/lib/locale'
import ArrowRightIcon from '../icons/ArrowRightIcon'
import Link from 'next/link'

gsap.registerPlugin(SplitText)
export type HeroTextSectionCta = {
  _type?: 'internal' | 'external' | 'fileUpload'
  label?: string | null
  slug?: string | null
  url?: string | null
  fileUrl?: string | null
}

interface HeroTextSectionProps {
  title?: InternationalizedValue | null
  titleMobile?: InternationalizedValue | null
  copy?: InternationalizedPortableText | null
  cta?: HeroTextSectionCta | null
  alignment?: 'left' | 'right' | null
  locale: string
}

export default function HeroTextSection({
  title,
  titleMobile,
  copy,
  cta,
  alignment = 'left',
  locale,
}: HeroTextSectionProps) {
  const headingRef = useRef<HTMLSpanElement>(null)

  const resolvedTitle = resolveInternationalized(title ?? undefined, locale)
  const resolvedTitleMobile = resolveInternationalized(
    titleMobile ?? title ?? undefined,
    locale
  )
  const titleForDesktop = resolvedTitle ?? resolvedTitleMobile
  const resolvedCopy = resolveInternationalizedPortableText(copy ?? undefined, locale)
  const ctaLabel = cta?.label ?? null
  const ctaHref = cta?.slug != null ? `/${cta.slug}` : cta?.url ?? cta?.fileUrl ?? null
  useEffect(() => {
    const el = headingRef.current
    if (!el?.textContent?.trim()) return
    const split = new SplitText(el, {
      type: 'lines',
      linesClass: 'out-of-view',
    })
    return () => {
      split.revert()
      split.kill()
    }
  }, [titleForDesktop])

  if (!resolvedTitle && !resolvedCopy) return null

  const alignmentClass =
    alignment === 'right' ? 'align-right' : 'align-left'

  const copyBlock = (
    <div className="col-5-12_lg text">
      <PortableText value={resolvedCopy as any} components={portableTextComponents} />
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="cta-link">
          {ctaLabel}
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  )

  return (
    <section className={`hero-text-section ${alignmentClass} h-pad`}>
      {(titleForDesktop || resolvedTitleMobile) && (
        <h1 className="heading">
          {titleForDesktop && (
            <span ref={headingRef} className="desktop">
              {titleForDesktop}
            </span>
          )}
          {resolvedTitleMobile && (
            <span className="mobile">{resolvedTitleMobile}</span>
          )}
        </h1>
      )}

      {resolvedCopy && (
        <div className="row-lg text-wrap out-of-view">
          {alignment === 'right' ? (
            <>
              <div className="col-7-12_lg dummy-col"></div>
              {copyBlock}
            </>
          ) : (
            <>
              {copyBlock}
              <div className="col-7-12_lg dummy-col"></div>
            </>
          )}
        </div>
      )}
    </section>
  )
}
