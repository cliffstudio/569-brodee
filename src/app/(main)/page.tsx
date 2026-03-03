import { client } from '@/sanity/client'
import { pageBySlugQuery } from '@/sanity/lib/queries'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import BodyClassProvider from '@/components/BodyClassProvider'
import FlexibleContent from '@/components/FlexibleContent'
import { DEFAULT_LOCALE, LOCALE_COOKIE } from '@/lib/locale'

export const revalidate = 0

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
