import { Code2, Database, Wrench, Briefcase, Rocket, GraduationCap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { skills } from '@/data/skills'
import type { Locale } from '@/i18n/routing'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

const ANIMATION_STEP_S = 0.15

type CategoryKey = 'frontend' | 'backend' | 'tools'

const categoryConfig: Record<
  CategoryKey,
  {
    Icon: LucideIcon
    bg: string
    tagHover: string
    descKey: 'frontendDesc' | 'backendDesc' | 'toolsDesc'
  }
> = {
  frontend: {
    Icon: Code2,
    bg: 'bg-primary',
    tagHover: 'hover:bg-primary hover:text-white hover:border-primary',
    descKey: 'frontendDesc',
  },
  backend: {
    Icon: Database,
    bg: 'bg-yellow',
    tagHover: 'hover:bg-yellow hover:text-foreground hover:border-yellow',
    descKey: 'backendDesc',
  },
  tools: {
    Icon: Wrench,
    bg: 'bg-lavender',
    tagHover: 'hover:bg-lavender hover:text-white hover:border-lavender',
    descKey: 'toolsDesc',
  },
}

const categories: CategoryKey[] = ['frontend', 'backend', 'tools']

const highlights: {
  Icon: LucideIcon
  value: string
  labelKey: 'statYears' | 'statProjects' | 'statLearning'
  bg: string
  text: string
}[] = [
  {
    Icon: Briefcase,
    value: '5+',
    labelKey: 'statYears',
    bg: 'bg-primary',
    text: 'text-primary-foreground',
  },
  {
    Icon: Rocket,
    value: '50+',
    labelKey: 'statProjects',
    bg: 'bg-yellow',
    text: 'text-foreground',
  },
  {
    Icon: GraduationCap,
    value: '∞',
    labelKey: 'statLearning',
    bg: 'bg-lavender',
    text: 'text-primary-foreground',
  },
]

export async function SkillsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'skills' })

  return (
    <SectionWrapper
      id="skills"
      aria-label={t('sectionTitle')}
      className="bg-white relative overflow-hidden"
    >
      {/* Background blur decorations */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full opacity-5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-yellow rounded-full opacity-5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Section header */}
      <div className="text-center mb-16 animate-fade-in-up space-y-4">
        <h2 className="text-5xl md:text-6xl font-semibold text-foreground">{t('sectionTitle')}</h2>
        <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
          {t('sectionSubtitle')}
        </p>
      </div>

      {/* Skills categories grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {categories.map((key, index) => {
          const { Icon, bg, tagHover, descKey } = categoryConfig[key]
          const categorySkills = skills[key]
          return (
            <div
              key={key}
              className="bg-cream rounded-4xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border-4 border-white animate-fade-in-up"
              style={{ animationDelay: `${index * ANIMATION_STEP_S}s` }}
            >
              {/* Category header */}
              <div className="mb-6">
                <div
                  className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center shadow-md mb-4 text-white`}
                >
                  <Icon size={28} aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">{t(key)}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{t(descKey)}</p>
              </div>

              {/* Skills tag grid */}
              <ul className="grid grid-cols-2 gap-3">
                {categorySkills.map((skill) => (
                  <li key={skill}>
                    <div
                      className={`bg-white rounded-xl px-4 py-3 text-center border-2 border-transparent transition-all hover:shadow-md hover:scale-105 ${tagHover} cursor-default`}
                    >
                      <span className="text-sm text-foreground/80">{skill}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Highlights */}
      <div className="grid md:grid-cols-3 gap-6 mb-16 animate-fade-in-up">
        {highlights.map(({ Icon, value, labelKey, bg, text }) => (
          <div
            key={labelKey}
            className={`${bg} rounded-4xl p-8 text-center ${text} hover:scale-105 transition-transform shadow-lg`}
          >
            <div className="flex justify-center mb-3">
              <Icon size={32} aria-hidden="true" />
            </div>
            <div className="text-4xl font-bold mb-2">{value}</div>
            <div className="text-sm opacity-90">{t(labelKey)}</div>
          </div>
        ))}
      </div>

      {/* Additional tech tags */}
      <div className="text-center animate-fade-in-up">
        <p className="text-foreground/40 text-sm mb-6">{t('moreLabel')}</p>
        <ul className="flex flex-wrap justify-center gap-3">
          {skills.extra.map((tech) => (
            <li key={tech}>
              <span className="px-4 py-2 bg-muted text-foreground/70 rounded-full text-sm hover:bg-primary hover:text-white transition-colors cursor-default">
                {tech}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  )
}
