import { getRequestConfig } from 'next-intl/server'
import { isSupportedLocale, routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !isSupportedLocale(locale)) {
    locale = routing.defaultLocale
  }

  const messages =
    locale === 'sv'
      ? (await import('../messages/sv.json')).default
      : (await import('../messages/en.json')).default

  return {
    locale,
    messages,
  }
})
