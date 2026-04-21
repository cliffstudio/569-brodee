'use client'

import { useEffect, useMemo, useRef } from 'react'
import { PortableText } from '@portabletext/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { portableTextComponents } from '@/components/PortableTextComponents'
import {
  resolveInternationalized,
  resolveInternationalizedPortableText,
  type InternationalizedValue,
  type InternationalizedPortableText,
} from '@/lib/locale'
import ArrowRightIcon from '../icons/ArrowRightIcon'
import Link from 'next/link'

gsap.registerPlugin(SplitText)

const SOFT_HYPHEN = '\u00AD'
const LONG_WORD_REGEX = /\p{L}{10,}/gu

function addSoftHyphensToWord(word: string, chunkSize = 7) {
  if (word.length <= chunkSize) return word
  return word.replace(new RegExp(`(.{${chunkSize}})`, 'g'), `$1${SOFT_HYPHEN}`).replace(/\u00AD$/u, '')
}

function addSoftHyphensToText(text: string) {
  return text.replace(LONG_WORD_REGEX, (word) => addSoftHyphensToWord(word))
}

function addSoftHyphensToPortableText(blocks: unknown[] | null) {
  if (!Array.isArray(blocks)) return blocks
  return blocks.map((block) => {
    if (!block || typeof block !== 'object') return block
    const maybeBlock = block as { _type?: string; children?: unknown[] }
    if (maybeBlock._type !== 'block' || !Array.isArray(maybeBlock.children)) return block

    return {
      ...maybeBlock,
      children: maybeBlock.children.map((child) => {
        if (!child || typeof child !== 'object') return child
        const maybeSpan = child as { _type?: string; text?: unknown }
        if (maybeSpan._type !== 'span' || typeof maybeSpan.text !== 'string') return child
        return {
          ...maybeSpan,
          text: addSoftHyphensToText(maybeSpan.text),
        }
      }),
    }
  })
}
export type HeroTextSectionCta = {
  _type?: 'internal' | 'external' | 'fileUpload'
  label?: string | null
  labelI18n?: InternationalizedValue | null
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
  const titleForDesktopHyphenated = useMemo(
    () => addSoftHyphensToPortableText(titleForDesktop),
    [titleForDesktop]
  )
  const titleForMobileHyphenated = useMemo(
    () => addSoftHyphensToPortableText(resolvedTitleMobile),
    [resolvedTitleMobile]
  )
  const resolvedCopy = resolveInternationalizedPortableText(copy ?? undefined, locale)
  const ctaLabel = resolveInternationalized(cta?.labelI18n ?? undefined, locale) ?? cta?.label ?? null
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
  }, [titleForDesktopHyphenated, titleForMobileHyphenated])

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
      {(titleForDesktopHyphenated || titleForMobileHyphenated) && (
        <h1 className="heading">
          {titleForDesktopHyphenated && (
            <span ref={desktopHeadingRef} className="desktop" lang={locale}>
              <PortableText
                value={titleForDesktopHyphenated as any}
                components={{
                  block: {
                    normal: ({ children }) => <>{children}</>,
                  },
                }}
              />
            </span>
          )}
          {titleForMobileHyphenated && (
            <span ref={mobileHeadingRef} className="mobile" lang={locale}>
              <PortableText
                value={titleForMobileHyphenated as any}
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
