import { Github, Linkedin, Mail, Sparkles } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { profile } from '@/data/profile'
import type { Locale } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'
import { getInitials } from '@/lib/utils'

export async function HeroSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'hero' })

  return (
    <section
      id="hero"
      aria-label={t('ariaLabel')}
      className="min-h-screen flex items-center justify-center bg-cream px-6 py-20 relative overflow-hidden"
    >
      {/* Background blur circles */}
      <div
        className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full opacity-20 blur-3xl animate-pulse-slow pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 w-80 h-80 bg-yellow rounded-full opacity-20 blur-3xl animate-pulse-slow delay-300 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/3 w-48 h-48 bg-lavender rounded-full opacity-20 blur-2xl animate-float pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left — text content */}
        <div className="space-y-6 animate-fade-in-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-foreground/70">
            <Sparkles size={16} className="text-primary" aria-hidden="true" />
            {t('badge')}
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight">
            <span className="text-foreground/60 text-3xl md:text-4xl block mb-2">
              {t('greeting')}
            </span>
            <span className="text-primary font-semibold">{profile.name}</span>
          </h1>

          {/* Title */}
          <p className="text-xl md:text-2xl text-foreground/70 font-medium">{t('title')}</p>

          {/* Description */}
          <p className="text-base text-foreground/60 max-w-md leading-relaxed">
            {t('description')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              href="#projects"
              className="group px-8 py-4 text-base hover:scale-105 hover:-translate-y-1"
            >
              {t('ctaProjects')}
            </Button>
            <Button
              href="#contact"
              variant="outline"
              className="px-8 py-4 text-base bg-white text-foreground hover:bg-white hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
            >
              {t('ctaContact')}
            </Button>
          </div>

          {/* Social links */}
          <ul className="flex items-center gap-4 pt-2" aria-label="Social links">
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-2xl bg-white shadow flex items-center justify-center text-foreground/60 hover:text-primary hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Github size={20} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-2xl bg-white shadow flex items-center justify-center text-foreground/60 hover:text-primary hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Linkedin size={20} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="w-10 h-10 rounded-2xl bg-white shadow flex items-center justify-center text-foreground/60 hover:text-primary hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail size={20} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        {/* Right — decorative card */}
        <div className="relative animate-fade-in-right hidden md:block">
          {/* Floating corner decorations */}
          <div
            className="absolute -top-4 -right-4 w-16 h-16 bg-yellow rounded-2xl shadow-lg animate-float pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-4 -left-4 w-20 h-20 bg-lavender rounded-2xl shadow-lg animate-float delay-200 pointer-events-none"
            aria-hidden="true"
          />

          <div className="bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-primary">
            {/* Avatar placeholder */}
            <div className="w-full aspect-square bg-linear-to-br from-primary to-mint-light rounded-[2.5rem] mb-6 flex items-center justify-center">
              <span className="text-white text-6xl font-bold select-none">
                {getInitials(profile.name)}
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-yellow rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{profile.stats.yearsValue}</div>
                <div className="text-xs text-foreground/60 mt-1">{t('statsYears')}</div>
              </div>
              <div className="bg-primary rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{profile.stats.projectsValue}</div>
                <div className="text-xs text-white/80 mt-1">{t('statsProjects')}</div>
              </div>
              <div className="bg-lavender rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{profile.stats.passionValue}</div>
                <div className="text-xs text-white/80 mt-1">{t('statsPassion')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
