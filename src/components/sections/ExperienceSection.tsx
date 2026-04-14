import { Briefcase, Calendar, CheckCircle2, MapPin } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { Experience } from '@/types/experience'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

const ANIMATION_STEP_S = 0.2

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
      className="bg-cream relative overflow-hidden"
    >
      {/* Background blur decorations */}
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-lavender rounded-full opacity-5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full opacity-5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Section header */}
      <div className="text-center mb-16 animate-fade-in-up space-y-4">
        <h2 className="text-5xl md:text-6xl font-semibold text-foreground">{t('sectionTitle')}</h2>
        <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
          {t('sectionSubtitle')}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical centre line — desktop only */}
        <div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-yellow to-lavender -translate-x-1/2 pointer-events-none"
          aria-hidden="true"
        />

        <div className="space-y-12">
          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * ANIMATION_STEP_S}s` }}
            >
              {/* Timeline dot */}
              <div
                className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-4 border-primary rounded-full z-10 shadow-lg"
                aria-hidden="true"
              />

              {/* Card — alternating left / right on desktop */}
              <div
                className={`md:w-[calc(50%-3rem)] ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'
                }`}
              >
                <article className="bg-white rounded-4xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border-4 border-white">
                  {/* Current position badge */}
                  {experience.current && (
                    <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-sm rounded-full mb-4">
                      {t('currentPosition')}
                    </span>
                  )}

                  {/* Role + company + meta */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-foreground mb-3">
                      {experience.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-foreground/60 mb-2">
                      <span className="inline-flex items-center gap-2">
                        <Briefcase size={18} className="text-primary" aria-hidden="true" />
                        {experience.company}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={18} className="text-yellow" aria-hidden="true" />
                        {experience.location}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 text-foreground/50 text-sm">
                      <Calendar size={16} aria-hidden="true" />
                      {formatPeriod(
                        experience.startDate,
                        experience.endDate,
                        experience.current,
                        t('present'),
                      )}
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div className="mb-6">
                    <h4 className="text-xs uppercase text-foreground/40 tracking-wider mb-3">
                      {t('responsibilitiesLabel')}
                    </h4>
                    <ul className="space-y-2">
                      {experience.responsibilities.map((responsibility) => (
                        <li key={responsibility} className="flex items-start gap-3">
                          <CheckCircle2
                            size={18}
                            className="text-primary shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="text-foreground/70 text-sm leading-relaxed">
                            {responsibility}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase text-foreground/40 tracking-wider mb-3">
                        {t('technologiesLabel')}
                      </h4>
                      <ul className="flex flex-wrap gap-2" aria-label={t('technologiesUsed')}>
                        {experience.technologies.map((technology) => (
                          <li
                            key={technology}
                            className="rounded-full border-2 border-primary/15 bg-primary/8 px-3 py-1.5 text-sm text-primary"
                          >
                            {technology}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
