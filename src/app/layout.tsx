import type { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import StoryblokProvider from '@/components/StoryblokProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const isPreview = process.env.STORYBLOK_IS_PREVIEW === 'true'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()
  const html = (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
  return isPreview ? <StoryblokProvider>{html}</StoryblokProvider> : html
}
