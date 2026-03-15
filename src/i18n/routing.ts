import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'sv'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const ogLocaleMap: Record<Locale, string> = {
  en: 'en_US',
  sv: 'sv_SE',
}

export function isSupportedLocale(locale: string): locale is Locale {
  return (locales as ReadonlyArray<string>).includes(locale)
}

export const routing = defineRouting({
  locales,
  defaultLocale,
})
