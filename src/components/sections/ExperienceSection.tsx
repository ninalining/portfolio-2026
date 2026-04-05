import { Briefcase, CalendarDays, MapPin } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { Experience } from '@/types/experience'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

function formatPeriod(
  startDate: string,
  endDate: string | null,
  current: boolean,
  presentLabel: string,
) {
  const end = current ? presentLabel : endDate
  return end ? `${startDate} - ${end}` : startDate
}

export async function ExperienceSection({
  locale,
  experiences,
}: {
  locale: Locale
  experiences: Experience[]
}) {
  const t = await getTranslations({ locale, namespace: 'experience' })

  if (experiences.length === 0) {
    return null
  }

  return (
    <SectionWrapper
      id="experience"
      aria-label={t('sectionTitle')}
      className="bg-white relative overflow-hidden"
    >
      <div
        className="absolute top-12 left-12 w-72 h-72 bg-primary rounded-full opacity-5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-12 right-12 w-72 h-72 bg-lavender rounded-full opacity-5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="text-center mb-16 space-y-4 animate-fade-in-up">
        <h2 className="text-5xl md:text-6xl font-semibold text-foreground">{t('sectionTitle')}</h2>
      </div>

      <div className="space-y-8">
        {experiences.map((experience) => (
          <article
            key={experience.id}
            className="bg-cream rounded-4xl p-8 shadow-lg border-4 border-white hover:shadow-xl transition-all"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-foreground/70 shadow-sm">
                    <Briefcase size={16} aria-hidden="true" />
                    {experience.company}
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">{experience.role}</h3>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={16} aria-hidden="true" />
                    {formatPeriod(
                      experience.startDate,
                      experience.endDate,
                      experience.current,
                      t('present'),
                    )}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} aria-hidden="true" />
                    {experience.location}
                  </span>
                </div>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-foreground/70 leading-relaxed list-disc pl-5">
              {experience.responsibilities.map((responsibility) => (
                <li key={responsibility}>{responsibility}</li>
              ))}
            </ul>

            {experience.technologies && experience.technologies.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={t('technologiesUsed')}>
                {experience.technologies.map((technology) => (
                  <li
                    key={technology}
                    className="rounded-full border-2 border-primary/15 bg-primary/8 px-3 py-1.5 text-sm text-primary"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
