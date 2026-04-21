import { client } from '@/sanity/client'
import { pageBySlugQuery } from '@/sanity/lib/queries'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import BodyClassProvider from '@/components/BodyClassProvider'
import FlexibleContent from '@/components/FlexibleContent'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  resolveInternationalized,
  resolveInternationalizedPortableText,
  type InternationalizedPortableText,
  type InternationalizedValue,
} from '@/lib/locale'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'

const PAGE_SLUGS = ['about', 'works', 'contact', 'privacy', 'privacy-policy'] as const

export const revalidate = 0

export function generateStaticParams() {
  return PAGE_SLUGS.map((slug) => ({ slug }))
}

export default async function PageBySlug({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cookieStore = await cookies()
  const locale = cookieStore.get(LOCALE_COOKIE)?.value ?? DEFAULT_LOCALE

  const page = await client.fetch(pageBySlugQuery, { slug })

  if (!page) {
    notFound()
  }

  const isPolicyTemplate = page.template === 'policy'
  const policySections = (isPolicyTemplate && Array.isArray(page.policySections) ? page.policySections : []) as {
    title?: InternationalizedValue | null
    text?: InternationalizedPortableText | null
  }[]

  return (
    <>
      <BodyClassProvider page={slug} background={page.backgroundColour} />
      <main>
        {isPolicyTemplate ? (
          <div className="policy-page h-pad row-lg">
            <div className="col-3-12_lg" />

            <div className="content-wrap col-6-12_lg out-of-view">
              <h2 className="uppercase">{page.title ?? ''}</h2>

              {policySections.map((section, i) => (
                <section key={i} className="policy-section">
                  {resolveInternationalized(section.title ?? undefined, locale) && (
                    <h2 className="heading uppercase">
                      {resolveInternationalized(section.title ?? undefined, locale)}
                    </h2>
                  )}
                  {resolveInternationalizedPortableText(section.text ?? undefined, locale) != null ? (
                    <div className="copy">
                      <PortableText
                        value={resolveInternationalizedPortableText(section.text ?? undefined, locale) as any}
                        components={portableTextComponents}
                      />
                    </div>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="col-3-12_lg" />
          </div>
        ) : (
          <FlexibleContent contentBlocks={page.contentBlocks} locale={locale} />
        )}
      </main>
    </>
  )
}
