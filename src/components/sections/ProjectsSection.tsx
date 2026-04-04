import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { projects } from '@/data/projects'
import type { Locale } from '@/i18n/routing'
import type { ProjectAccent } from '@/types/project'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

const ANIMATION_STEP_S = 0.1

const accentTagClass: Record<ProjectAccent, string> = {
  mint: 'bg-primary/10 text-primary border-2 border-primary/20',
  yellow: 'bg-yellow/20 text-foreground/70 border-2 border-yellow/40',
  lavender: 'bg-lavender/20 text-foreground/70 border-2 border-lavender/40',
}

export async function ProjectsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'projects' })

  return (
    <SectionWrapper
      id="projects"
      aria-label={t('sectionTitle')}
      className="bg-cream relative overflow-hidden"
    >
      {/* Background blur decorations */}
      <div
        className="absolute top-10 right-20 w-72 h-72 bg-yellow rounded-full opacity-10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-10 w-64 h-64 bg-lavender rounded-full opacity-10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Section header */}
      <div className="text-center mb-16 animate-fade-in-up space-y-4">
        <h2 className="text-5xl md:text-6xl font-semibold text-foreground">{t('sectionTitle')}</h2>
        <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
          {t('sectionSubtitle')}
        </p>
      </div>

      {/* Projects grid */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        {projects.map((project, index) => {
          const tagClass = accentTagClass[project.accent]
          return (
            <li
              key={project.slug}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * ANIMATION_STEP_S}s` }}
            >
              <article
                className="group flex flex-col h-full bg-white rounded-4xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 border-4 border-white"
                aria-label={project.title}
              >
                {/* Cover image */}
                <div className="relative h-56 overflow-hidden shrink-0">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-yellow/20 to-lavender/20 flex items-center justify-center">
                      <span className="text-7xl font-bold text-primary/20 select-none">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay with action buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${t('viewProject')} — ${project.title}`}
                          className="flex-1 p-3 bg-white rounded-2xl hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ExternalLink size={20} className="text-foreground" aria-hidden="true" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${t('viewSource')} — ${project.title}`}
                          className="flex-1 p-3 bg-white rounded-2xl hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Github size={20} className="text-foreground" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-6 gap-4">
                  {/* Title + summary */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                    <p className="text-foreground/60 leading-relaxed">{project.summary}</p>
                  </div>

                  {/* Tags */}
                  <ul className="flex flex-wrap gap-2" aria-label={t('technologiesUsed')}>
                    {project.tags.map((tag) => (
                      <li key={tag} className={`px-3 py-1.5 text-sm rounded-full ${tagClass}`}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </SectionWrapper>
  )
}
