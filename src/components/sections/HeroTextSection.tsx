'use client'

import { useEffect, useRef } from 'react'
import { PortableText } from '@portabletext/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { portableTextComponents } from '@/components/PortableTextComponents'
import {
  resolveInternationalizedPortableText,
  type InternationalizedPortableText,
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
  newTitle?: InternationalizedPortableText | null
  newTitleMobile?: InternationalizedPortableText | null
  copy?: InternationalizedPortableText | null
  cta?: HeroTextSectionCta | null
  alignment?: 'left' | 'right' | null
  locale: string
}

export default function HeroTextSection({
  newTitle,
  newTitleMobile,
  copy,
  cta,
  alignment = 'left',
  locale,
}: HeroTextSectionProps) {
  const desktopHeadingRef = useRef<HTMLSpanElement>(null)
  const mobileHeadingRef = useRef<HTMLSpanElement>(null)

  const resolvedTitle = resolveInternationalizedPortableText(newTitle ?? undefined, locale)
  const resolvedTitleMobile =
    resolveInternationalizedPortableText(newTitleMobile ?? undefined, locale) ??
    resolvedTitle
  const titleForDesktop = resolvedTitle ?? resolvedTitleMobile
  const resolvedCopy = resolveInternationalizedPortableText(copy ?? undefined, locale)
  const ctaLabel = cta?.label ?? null
  const ctaHref = cta?.slug != null ? `/${cta.slug}` : cta?.url ?? cta?.fileUrl ?? null

  useEffect(() => {
    const instances: SplitText[] = []

    const desktopEl = desktopHeadingRef.current
    if (desktopEl?.textContent?.trim()) {
      instances.push(
        new SplitText(desktopEl, {
          type: 'lines',
          linesClass: 'out-of-view',
        })
      )
    }

    const mobileEl = mobileHeadingRef.current
    if (mobileEl?.textContent?.trim()) {
      instances.push(
        new SplitText(mobileEl, {
          type: 'lines',
          linesClass: 'out-of-view',
        })
      )
    }

    if (!instances.length) return

    return () => {
      instances.forEach((split) => {
        split.revert()
        split.kill()
      })
    }
  }, [titleForDesktop, resolvedTitleMobile])

  if (!resolvedTitle && !resolvedCopy) return null

  const alignmentClass =
    alignment === 'right' ? 'align-right' : 'align-left'

  const copyBlock = (
    <div className="col-5-12_lg text">
      <PortableText value={resolvedCopy as any} components={portableTextComponents} />
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="cta-link script-font">
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
            <span ref={desktopHeadingRef} className="desktop">
              <PortableText
                value={titleForDesktop as any}
                components={{
                  block: {
                    normal: ({ children }) => <>{children}</>,
                  },
                }}
              />
            </span>
          )}
          {resolvedTitleMobile && (
            <span ref={mobileHeadingRef} className="mobile">
              <PortableText
                value={resolvedTitleMobile as any}
                components={{
                  block: {
                    normal: ({ children }) => <>{children}</>,
                  },
                }}
              />
            </span>
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
