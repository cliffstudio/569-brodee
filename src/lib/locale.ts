/**
 * Single source of truth for locale/language.
 * Use LOCALE_COOKIE when reading the cookie in layout or server components.
 * Use SUPPORTED_LOCALES when rendering the switcher or validating locale in queries.
 */

export const LOCALE_COOKIE = 'locale'

export const DEFAULT_LOCALE = 'en' as const

export const SUPPORTED_LOCALES = [
  { id: 'en', label: 'EN' },
  { id: 'es', label: 'ES' },
] as const

export type LocaleId = (typeof SUPPORTED_LOCALES)[number]['id']

export function isValidLocale(value: string): value is LocaleId {
  return SUPPORTED_LOCALES.some((l) => l.id === value)
}

/** Shape of internationalized array from Sanity (e.g. homepageHeading) */
export type InternationalizedValue = { _key: string; value?: string }[]

/** Resolve a string from an internationalized array by locale, with fallback to first item */
export function resolveInternationalized(
  arr: InternationalizedValue | undefined,
  locale: string
): string | null {
  if (!Array.isArray(arr) || arr.length === 0) return null
  const item = arr.find((i) => i._key === locale)
  return (item?.value ?? arr[0]?.value) ?? null
}

/** Shape of internationalized portable text from Sanity (e.g. home page text) */
export type InternationalizedPortableText = {
  _key: string
  value?: unknown[]
}[]

/** Resolve portable text from an internationalized array by locale, with fallback to first item */
export function resolveInternationalizedPortableText(
  arr: InternationalizedPortableText | undefined,
  locale: string
): unknown[] | null {
  if (!Array.isArray(arr) || arr.length === 0) return null
  const item = arr.find((i) => i._key === locale)
  const blocks = item?.value ?? arr[0]?.value
  return Array.isArray(blocks) ? blocks : null
}
