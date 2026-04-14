import { Sparkles } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Profile } from '@/types/profile'
import type { Locale } from '@/i18n/routing'

export async function Footer({
  locale,
  profile,
}: {
  locale: Locale
  profile: Pick<Profile, 'name'>
}) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const year = new Date().getFullYear()

  return (
    <footer
      aria-label="Site footer"
      className="bg-linear-to-r from-primary via-mint-light to-primary text-white py-12 px-6 relative overflow-hidden"
    >
      {/* Decorative blur blobs */}
      <div
        className="absolute top-0 left-1/4 w-32 h-32 bg-yellow rounded-full opacity-20 blur-2xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-40 h-40 bg-lavender rounded-full opacity-20 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Icon */}
        <div className="mb-6 flex justify-center" aria-hidden="true">
          <Sparkles size={32} className="animate-pulse-slow" />
        </div>

        {/* Copyright */}
        <p className="text-white/95 mb-3 text-lg">
          &copy; {year} {profile.name}. {t('rights')}
        </p>

        {/* Tagline */}
        <p className="text-white/80 text-sm">{t('tagline')}</p>

        {/* Decorative dots */}
        <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
          <div className="w-3 h-3 bg-yellow rounded-full" />
          <div className="w-3 h-3 bg-white rounded-full" />
          <div className="w-3 h-3 bg-lavender rounded-full" />
        </div>
      </div>
    </footer>
  )
}
