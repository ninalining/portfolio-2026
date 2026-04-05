import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { defaultLocale, isSupportedLocale, locales, ogLocaleMap } from '@/i18n/routing'
import type { LocaleLayoutProps } from '@/types/locale'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }))
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  title: {
    default: 'Nina Li — Full-Stack Engineer',
    template: '%s | Nina Li',
  },
  description:
    'Portfolio of Nina Li — Full-Stack Engineer specialising in Next.js, TypeScript, and performance-driven web development.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: ogLocaleMap[defaultLocale],
    url: siteUrl,
    siteName: 'Nina Li',
    title: 'Nina Li — Full-Stack Engineer',
    description:
      'Full-Stack Engineer specialising in Next.js, TypeScript, and performance-driven web development.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nina Li — Full-Stack Engineer',
    description:
      'Full-Stack Engineer specialising in Next.js, TypeScript, and performance-driven web development.',
  },
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!isSupportedLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navigation />
      {children}
      <Footer locale={locale} />
    </NextIntlClientProvider>
  )
}
