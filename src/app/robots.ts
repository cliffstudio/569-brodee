import type { MetadataRoute } from 'next'

function getBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
  const fallback = 'http://localhost:3000'
  return (fromEnv ?? fallback).replace(/\/$/, '')
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
