import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { defaultLocale, isSupportedLocale, locales, ogLocaleMap } from '@/i18n/routing'
import type { LocalePageProps } from '@/types/locale'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params
  const resolvedLocale = isSupportedLocale(locale) ? locale : defaultLocale

  return {
    openGraph: {
      locale: ogLocaleMap[resolvedLocale],
    },
  }
}

export default async function Home({ params }: LocalePageProps) {
  const { locale: rawLocale } = await params
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale
  setRequestLocale(locale)

  return (
    <main>
      <HeroSection locale={locale} />

      <AboutSection locale={locale} />

      {/* Experience */}
      <section id="experience" aria-label="Work experience">
        {/* TODO: Experience section */}
      </section>

      {/* Skills */}
      <section id="skills" aria-label="Skills">
        {/* TODO: Skills section */}
      </section>

      {/* Projects */}
      <ProjectsSection locale={locale} />

      {/* Contact */}
      <section id="contact" aria-label="Contact">
        {/* TODO: Contact section */}
      </section>
    </main>
  )
}
