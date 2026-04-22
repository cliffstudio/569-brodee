import { client } from '@/sanity/client'
import { pageBySlugQuery, pageMetadataBySlugQuery } from '@/sanity/lib/queries'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import BodyClassProvider from '@/components/BodyClassProvider'
import FlexibleContent from '@/components/FlexibleContent'
import { DEFAULT_LOCALE, LOCALE_COOKIE } from '@/lib/locale'
import type { Metadata } from 'next'
import { buildSeoMetadata } from '@/lib/metadata'

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const metaData = await client.fetch(pageMetadataBySlugQuery, { slug: '' })
  return buildSeoMetadata(metaData)
}

export default async function Home() {
  const cookieStore = await cookies()
  const locale = cookieStore.get(LOCALE_COOKIE)?.value ?? DEFAULT_LOCALE

  const page = await client.fetch(pageBySlugQuery, { slug: '' })

  if (!page) {
    notFound()
  }

  return (
    <>
      <BodyClassProvider page="home" background={page.backgroundColour} />
      <main>
        <FlexibleContent contentBlocks={page.contentBlocks} locale={locale} />
      </main>
    </>
  )
}
