import { client } from '@/sanity/client'
import { caseStudyBySlugQuery, caseStudySlugsQuery } from '@/sanity/lib/queries'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import BodyClassProvider from '@/components/BodyClassProvider'
import FlexibleContent from '@/components/FlexibleContent'
import { PortableText } from '@portabletext/react'
import { DEFAULT_LOCALE, LOCALE_COOKIE } from '@/lib/locale'

export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await client.fetch(caseStudySlugsQuery)
  return (slugs ?? []).map((s: { slug: string }) => ({ slug: s.slug }))
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const cookieStore = await cookies()
  const locale = cookieStore.get(LOCALE_COOKIE)?.value ?? DEFAULT_LOCALE
  const caseStudy = await client.fetch(caseStudyBySlugQuery, { slug })

  if (!caseStudy) {
    notFound()
  }

  const date = caseStudy.publishedAt
    ? new Date(caseStudy.publishedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <>
      <BodyClassProvider page={slug} background={caseStudy.backgroundColour} />
      <main>
        <FlexibleContent contentBlocks={caseStudy.contentBlocks} locale={locale} />
      </main>
    </>
  )
}
