import { client } from '@/sanity/client'
import { caseStudiesQuery } from '@/sanity/lib/queries'
import BodyClassProvider from '@/components/BodyClassProvider'
import Link from 'next/link'

export const revalidate = 0

export default async function CaseStudiesPage() {
  const caseStudies = await client.fetch(caseStudiesQuery)

  return (
    <>
      <BodyClassProvider page="case-studies" />
      <main>
        <h1>Case Studies</h1>
        <ul>
          {caseStudies?.map((study: { _id: string; title: string | null; slug: string }) => (
            <li key={study._id}>
              <Link href={`/works/${study.slug}`}>{study.title || 'Untitled'}</Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
