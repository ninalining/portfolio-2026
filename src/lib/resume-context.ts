import { unstable_cache } from 'next/cache'
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc'
import { getLanguage, parseSortOrder, splitCsvList, splitMultilineList } from './storyblok-utils'
import type {
  ProfileContentRaw,
  HomeContentRaw,
  ExperienceStoryRaw,
  ProjectStoryRaw,
  RichTextNode,
  HeroSectionRaw,
  AboutSectionRaw,
  SkillsSectionRaw,
} from '@/types/resume-raw'

// ---------------------------------------------------------------------------
// Storyblok client (standalone — not using React.cache so it works in API routes)
// ---------------------------------------------------------------------------
function getApi() {
  return storyblokInit({
    accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
    use: [apiPlugin],
    apiOptions: { region: 'eu' },
  })()
}

const version = process.env.NODE_ENV === 'production' ? 'published' : 'draft'
const CACHE_REVALIDATE_SECONDS = 300

// ---------------------------------------------------------------------------
// Plain-text extractor for Storyblok rich text nodes
// ---------------------------------------------------------------------------
function richTextToPlain(node: RichTextNode): string {
  if (node.type === 'text') return node.text ?? ''
  if (!node.content?.length) return ''
  const joined = node.content.map(richTextToPlain).join('')
  if (node.type === 'paragraph') return `${joined}\n`
  if (node.type === 'bullet_list' || node.type === 'ordered_list') return joined
  if (node.type === 'list_item') return `- ${joined}`
  return joined
}

// ---------------------------------------------------------------------------
// Cached fetchers (revalidate every 5 minutes)
// ---------------------------------------------------------------------------
const fetchProfileRaw = unstable_cache(
  async (): Promise<ProfileContentRaw> => {
    const api = getApi()
    const { data } = await api.get('cdn/stories/config/profile', { version })
    return data.story.content as ProfileContentRaw
  },
  ['resume-profile'],
  { revalidate: CACHE_REVALIDATE_SECONDS },
)

const fetchHomeRaw = unstable_cache(
  async (locale: string): Promise<HomeContentRaw | null> => {
    const api = getApi()
    const result = await api
      .get('cdn/stories/home', { version, language: getLanguage(locale) })
      .catch(() => null)
    return result != null ? (result.data.story.content as HomeContentRaw) : null
  },
  ['resume-home'],
  { revalidate: CACHE_REVALIDATE_SECONDS },
)

const fetchExperiencesRaw = unstable_cache(
  async (locale: string): Promise<ExperienceStoryRaw[]> => {
    const api = getApi()
    const result = await api
      .get('cdn/stories', {
        version,
        language: getLanguage(locale),
        starts_with: 'experience/',
        per_page: 100,
      })
      .catch(() => null)
    return result != null ? (result.data.stories as ExperienceStoryRaw[]) : []
  },
  ['resume-experiences'],
  { revalidate: CACHE_REVALIDATE_SECONDS },
)

const fetchProjectsRaw = unstable_cache(
  async (locale: string): Promise<ProjectStoryRaw[]> => {
    const api = getApi()
    const result = await api
      .get('cdn/stories', {
        version,
        language: getLanguage(locale),
        starts_with: 'project/',
        per_page: 100,
      })
      .catch(() => null)
    return result != null ? (result.data.stories as ProjectStoryRaw[]) : []
  },
  ['resume-projects'],
  { revalidate: CACHE_REVALIDATE_SECONDS },
)

// ---------------------------------------------------------------------------
// Resume context builder
// ---------------------------------------------------------------------------
export async function getResumeContext(locale: string): Promise<string> {
  const [profileRaw, homeRaw, experiencesRaw, projectsRaw] = await Promise.all([
    fetchProfileRaw(),
    fetchHomeRaw(locale),
    fetchExperiencesRaw(locale),
    fetchProjectsRaw(locale),
  ])

  const sections: string[] = []

  // Profile
  const profileLines = [
    `- Name: ${profileRaw.name ?? 'Nina Li'}`,
    `- Email: ${profileRaw.email ?? ''}`,
    `- GitHub: ${profileRaw.github ?? ''}`,
    `- LinkedIn: ${profileRaw.linkedin ?? ''}`,
    profileRaw.location ? `- Location: ${profileRaw.location}` : '',
    profileRaw.availability ? `- Availability: ${profileRaw.availability}` : '',
    profileRaw.work_type ? `- Work Type: ${profileRaw.work_type}` : '',
    profileRaw.work_location ? `- Work Location: ${profileRaw.work_location}` : '',
    profileRaw.visa_status ? `- Visa / Work Authorization: ${profileRaw.visa_status}` : '',
    profileRaw.languages ? `- Languages: ${profileRaw.languages}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  sections.push(`# About Nina Li\n${profileLines}`)

  if (profileRaw.portfolio_tech) {
    sections.push(`## About This Portfolio\n${profileRaw.portfolio_tech}`)
  }

  // Hero / intro
  if (homeRaw) {
    const body = homeRaw.body ?? []
    const hero = body.find((b) => b.component === 'hero-section') as HeroSectionRaw | undefined
    const about = body.find((b) => b.component === 'about-section') as
      | AboutSectionRaw
      | undefined
    const skills = body.find((b) => b.component === 'skills-section') as
      | SkillsSectionRaw
      | undefined

    if (hero?.description) {
      sections.push(`## Professional Summary\n${hero.description}`)
    }

    if (about?.bio) {
      const bioText = richTextToPlain(about.bio).trim()
      if (bioText) sections.push(`## Bio\n${bioText}`)
    }

    if (about?.features?.length) {
      const featureLines = about.features
        .map((f) => `- **${f.title ?? ''}**: ${f.description ?? ''}`)
        .join('\n')
      sections.push(`## Key Traits\n${featureLines}`)
    }

    if (skills?.categories?.length) {
      const catLines = skills.categories
        .map((cat) => {
          const skillList = splitMultilineList(cat.skills).join(', ')
          return `- **${cat.title ?? cat.key ?? ''}**: ${skillList}`
        })
        .join('\n')
      const extraLine = splitCsvList(skills.extra).join(', ')
      sections.push(
        `## Skills\n${catLines}${extraLine ? `\n- **Other tools**: ${extraLine}` : ''}`,
      )
    }
  }

  // Experience
  if (experiencesRaw.length) {
    const sorted = experiencesRaw
      .map((s) => ({ ...s, _sort: parseSortOrder(s.content.sort_order) }))
      .sort((a, b) => a._sort - b._sort)

    const expLines = sorted
      .map((s) => {
        const c = s.content
        const period = c.current
          ? `${c.start_date ?? ''} – Present`
          : `${c.start_date ?? ''} – ${c.end_date ?? ''}`
        const resp = splitMultilineList(c.responsibilities).map((r) => `  - ${r}`).join('\n')
        const tech = splitCsvList(c.technologies).join(', ')
        return (
          `### ${c.company ?? s.name} — ${c.role ?? ''} (${period})\n` +
          `Location: ${c.location ?? ''}\n` +
          (resp ? `Responsibilities:\n${resp}\n` : '') +
          (tech ? `Technologies: ${tech}` : '')
        )
      })
      .join('\n\n')
    sections.push(`## Work Experience\n${expLines}`)
  }

  // Projects
  if (projectsRaw.length) {
    const sorted = projectsRaw
      .map((s) => ({ ...s, _sort: parseSortOrder(s.content.sort_order) }))
      .sort((a, b) => a._sort - b._sort)

    const projLines = sorted
      .map((s) => {
        const c = s.content
        const tags = splitCsvList(c.tags).join(', ')
        const links = [
          c.live_url ? `[Live](${c.live_url})` : '',
          c.github_url ? `[GitHub](${c.github_url})` : '',
        ]
          .filter(Boolean)
          .join(' | ')
        return (
          `### ${c.title ?? s.name}\n` +
          `${c.summary ?? ''}\n` +
          (tags ? `Tags: ${tags}\n` : '') +
          (links ? `Links: ${links}` : '')
        )
      })
      .join('\n\n')
    sections.push(`## Projects\n${projLines}`)
  }

  return sections.join('\n\n')
}
