export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SITE_URL must be set in production.')
  }

  return 'http://localhost:3000'
}
