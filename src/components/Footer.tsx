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
import type { HeaderMenuItem } from '@/components/Header'
import Logo from './Logo'

export type FooterProps = {
  footer: {
    title: InternationalizedValue | null
    menu: HeaderMenuItem[]
    text: InternationalizedPortableText | null
  }
  locale: string
}

function getLinkHref(item: HeaderMenuItem): string {
  if (item._type === 'internal' && item.slug != null) {
    return item.slug === '' ? '/' : `/${item.slug}`
  }
  if (item._type === 'external' && item.url) return item.url
  if (item._type === 'fileUpload' && item.fileUrl) return item.fileUrl
  return '#'
}

function MenuLink({ item }: { item: HeaderMenuItem }) {
  const label = item.label || item.pageTitle || 'Link'
  const href = getLinkHref(item)
  const isInternal = item._type === 'internal' && item.slug != null

  if (isInternal) {
    return (
      <Link href={href} className="footer-menu-link">
        {label}
      </Link>
    )
  }
  return (
    <a
      href={href}
      className="footer-menu-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
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

  return (
    <footer className="site-footer h-pad">
      <div className="row-lg footer-top">
        {resolvedTitle && (
          <div className="col-8-12_lg">
            <h2 className="footer-title">{resolvedTitle}</h2>
          </div>
        )}

        {menu.length > 0 && (
          <nav className="footer-nav col-2-12_lg" aria-label="Footer">
            {menu.map((item) => (
              <span key={item._key} className="footer-menu-item">
                <MenuLink item={item} />
              </span>
            ))}
          </nav>
        )}

        {hasText && (
          <div className="footer-contact col-2-12_lg">
            <PortableText value={resolvedText as any} components={portableTextComponents} />
          </div>
        )}
      </div>

      <div className="row-lg footer-bottom">
        <div className="col-10-12_lg">
          <div className="logo-wrap">
            <Logo />
            <Link href="/" />
          </div>
        </div>
        <div className="col-2-12_lg">
          Design by{' '}
          <a href="https://www.frostcollective.com/" target="_blank" rel="noopener noreferrer">
            Frost*Collective
          </a>
        </div>
      </div>
    </footer>
  )
}
