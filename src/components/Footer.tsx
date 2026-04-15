'use client'

import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from './PortableTextComponents'
import {
  InternationalizedValue,
  InternationalizedPortableText,
  resolveInternationalized,
  resolveInternationalizedPortableText,
} from '@/lib/locale'
import Logo from './Logo'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type FooterMenuItem = {
  _key: string
  iconUrl?: string | null
  link?: {
    href?: string | null
    openInNewTab?: boolean | null
  } | null
}

export type FooterProps = {
  footer: {
    title: InternationalizedValue | null
    menu: FooterMenuItem[]
    text: InternationalizedPortableText | null
  }
  locale: string
}

function MenuLink({ item }: { item: FooterMenuItem }) {
  const href = item.link?.href?.trim()
  if (!href) return null

  const isInternalPath = href.startsWith('/')
  const openInNewTab = Boolean(item.link?.openInNewTab) || !isInternalPath
  const label = `Footer social link: ${href}`

  return (
    <a
      href={href}
      className="footer-menu-link"
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      aria-label={label}
    >
      {item.iconUrl ? <img src={item.iconUrl} alt="" aria-hidden="true" /> : 'Link'}
    </a>
  )
}

export default function Footer({ footer, locale }: FooterProps) {
  const titleArray = footer?.title
  const resolvedTitle =
    Array.isArray(titleArray) && titleArray.length > 0
      ? resolveInternationalized(titleArray, locale)
      : null
  const menu = footer?.menu ?? []
  const text = footer?.text ?? null
  const resolvedText = resolveInternationalizedPortableText(text ?? undefined, locale)
  const hasText = resolvedText && resolvedText.length > 0
  const footerRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const footer = footerRef.current
    const footerInner = footer?.querySelector<HTMLElement>('.footer-inner')
    if (!footer || !footerInner) return

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia()

      media.add('(min-width: 769px)', () => {
        ScrollTrigger.create({
          trigger: footerInner,
          pin: true,
          start: 'bottom bottom',
          end: '+=248',
          invalidateOnRefresh: true,
        })
      })

      return () => media.revert()
    }, footer)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="site-footer">
      <div className="footer-inner h-pad">
        <div className="row-lg footer-top out-of-opacity">
          {resolvedTitle && (
            <div className="col-10-12_lg">
              <h2 className="footer-title">{resolvedTitle}</h2>
            </div>
          )}

          <div className="col-2-12_lg">
            {hasText && (
              <div className="footer-contact">
                <PortableText value={resolvedText as any} components={portableTextComponents} />
              </div>
            )}

            {menu.length > 0 && (
              <nav className="footer-nav" aria-label="Footer">
                {menu.map((item) => (
                  <span key={item._key} className="footer-menu-item">
                    <MenuLink item={item} />
                  </span>
                ))}
              </nav>
            )}
          </div>
        </div>

        <div className="row-lg footer-bottom out-of-opacity">
          <div className="col-10-12_lg">
            <div className="logo-wrap">
              <Logo />
              <Link href="/" />
            </div>
          </div>

          <div className="col-2-12_lg text-xs footer-bottom-text">
            <span className="footer-bottom-text-copyright">Design by <a href="https://www.frostcollective.com/" target="_blank" rel="noopener noreferrer">Frost*Collective</a></span>

            <span><a href="/privacy-policy">Privacy</a></span>
          </div>
        </div>
      </div>
    </footer>
  )
}
