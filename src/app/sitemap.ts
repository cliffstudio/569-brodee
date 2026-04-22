import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { getSiteUrl } from '@/lib/siteUrl'
import { groq } from 'next-sanity'

export const revalidate = 300

const pageSitemapQuery = groq`
  *[_type == "page"]{
    "slug": slug.current,
    _updatedAt
  }
`

const caseStudySitemapQuery = groq`
  *[_type == "caseStudy" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }
`

type PageEntry = {
  slug?: string
  _updatedAt?: string
}

type CaseStudyEntry = {
  slug: string
  _updatedAt?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()
  const publishedClient = client.withConfig({ perspective: 'published' })
  const [pages, caseStudies] = await Promise.all([
    publishedClient.fetch<PageEntry[]>(pageSitemapQuery),
    publishedClient.fetch<CaseStudyEntry[]>(caseStudySitemapQuery),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  const pageRoutes: MetadataRoute.Sitemap = (pages ?? [])
    .filter((page) => Boolean(page.slug))
    .map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page._updatedAt ? new Date(page._updatedAt) : undefined,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  const caseStudyRoutes: MetadataRoute.Sitemap = (caseStudies ?? []).map((caseStudy) => ({
    url: `${baseUrl}/works/${caseStudy.slug}`,
    lastModified: caseStudy._updatedAt ? new Date(caseStudy._updatedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...pageRoutes, ...caseStudyRoutes]
}
