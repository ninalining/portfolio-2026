import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { defaultLocale, isSupportedLocale, locales, ogLocaleMap } from '@/i18n/routing'
import type { LocalePageProps } from '@/types/locale'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { getExperiences, getHomePage, getProfile, getProjects } from '@/lib/storyblok'

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

  const [profile, homePage, experiences, projects] = await Promise.all([
    getProfile(),
    getHomePage(locale),
    getExperiences(locale),
    getProjects(locale),
  ])

  return (
    <main>
      <HeroSection locale={locale} profile={profile} hero={homePage.hero} />

      <AboutSection locale={locale} profile={profile} about={homePage.about} />

      <ExperienceSection locale={locale} experiences={experiences} />

      <ProjectsSection locale={locale} projects={projects} />

      {/* Skills */}
      <SkillsSection locale={locale} profile={profile} skillsContent={homePage.skills} />

      {/* Contact */}
      <ContactSection locale={locale} profile={profile} />
    </main>
  )
}
