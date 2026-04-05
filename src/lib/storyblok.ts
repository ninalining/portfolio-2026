import { cache } from 'react'
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc'
import type { StoryblokRichTextNode } from '@storyblok/richtext'
import type { Experience } from '@/types/experience'
import type { HomePageContent, HomeFeatureCard } from '@/types/home'
import type { Profile } from '@/types/profile'
import type { Project, ProjectAccent } from '@/types/project'
import type { SkillCategoryKey, SkillsSectionContent } from '@/types/skill'

const version = process.env.NODE_ENV === 'production' ? 'published' : 'draft'

function getLanguage(locale: string) {
  return locale === 'en' ? 'default' : locale
}

function splitMultilineList(value: string | undefined): string[] {
  return value
    ? value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    : []
}

function splitCsvList(value: string | undefined): string[] {
  return value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : []
}

function parseSortOrder(value: string | number | undefined): number {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 999
  }
  return 999
}

function resolveAccent(
  accent: Array<{ color?: ProjectAccent }> | undefined,
  fallback?: ProjectAccent,
): ProjectAccent {
  return accent?.[0]?.color ?? fallback ?? 'mint'
}

function isSkillCategoryKey(value: string | undefined): value is SkillCategoryKey {
  return value === 'frontend' || value === 'backend' || value === 'tools'
}

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
  },
})

export const getProfile = cache(async function getProfile(): Promise<Profile> {
  const api = getStoryblokApi()
  const { data } = await api.get('cdn/stories/config/profile', {
    version,
  })

  const c = data.story.content
  return {
    name: c.name,
    email: c.email,
    github: c.github,
    linkedin: c.linkedin,
    location: c.location ?? undefined,
    stats: {
      yearsValue: c.stats_years ?? '',
      projectsValue: c.stats_projects ?? '',
      passionValue: c.stats_passion ?? '',
    },
  }
})

export const getHomePage = cache(async function getHomePage(
  locale: string,
): Promise<HomePageContent> {
  const api = getStoryblokApi()
  const { data } = await api.get('cdn/stories/home', {
    version,
    language: getLanguage(locale),
  })

  const body = data.story.content.body ?? []
  const heroBlock = body.find(
    (block: { component?: string }) => block.component === 'hero-section',
  ) as { badge?: string; title?: string; description?: string } | undefined
  const aboutBlock = body.find(
    (block: { component?: string }) => block.component === 'about-section',
  ) as
    | {
        bio?: StoryblokRichTextNode<unknown>
        features?: Array<HomeFeatureCard>
      }
    | undefined
  const skillsBlock = body.find(
    (block: { component?: string }) => block.component === 'skills-section',
  ) as
    | {
        subtitle?: string
        extra?: string
        categories?: Array<{
          _uid: string
          key?: string
          title?: string
          description?: string
          skills?: string
        }>
      }
    | undefined

  const skillCategories = (skillsBlock?.categories ?? []).reduce<
    SkillsSectionContent['categories']
  >((result, category) => {
    if (!isSkillCategoryKey(category.key)) {
      return result
    }

    result.push({
      _uid: category._uid,
      key: category.key,
      title: category.title ?? '',
      description: category.description ?? '',
      skills: splitMultilineList(category.skills),
    })

    return result
  }, [])

  const skills: SkillsSectionContent | undefined = skillsBlock
    ? {
        subtitle: skillsBlock.subtitle ?? '',
        categories: skillCategories,
        extra: splitCsvList(skillsBlock.extra),
      }
    : undefined

  return {
    hero: {
      badge: heroBlock?.badge ?? '',
      title: heroBlock?.title ?? '',
      description: heroBlock?.description ?? '',
    },
    about: {
      bio: (aboutBlock?.bio ?? {
        type: 'doc',
        content: [],
      }) as StoryblokRichTextNode<unknown>,
      features: (aboutBlock?.features ?? []).map((feature) => ({
        _uid: feature._uid,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        color: feature.color,
        accent: feature.accent,
      })),
    },
    skills,
  }
})

export const getExperiences = cache(async function getExperiences(
  locale: string,
): Promise<Experience[]> {
  const api = getStoryblokApi()
  const { data } = await api.get('cdn/stories', {
    version,
    language: getLanguage(locale),
    starts_with: 'experience/',
    per_page: 100,
  })

  type SortableExperience = Experience & { sortOrder: number }

  return (
    (data.stories ?? []) as Array<{
      slug: string
      name: string
      content: {
        company?: string
        role?: string
        start_date?: string
        end_date?: string
        current?: boolean
        location?: string
        responsibilities?: string
        technologies?: string
        sort_order?: string | number
      }
    }>
  )
    .map(
      (story): SortableExperience => ({
        id: story.slug,
        company: story.content.company || story.name,
        role: story.content.role || '',
        startDate: story.content.start_date || '',
        endDate: story.content.end_date ? story.content.end_date : null,
        current: Boolean(story.content.current),
        location: story.content.location || '',
        responsibilities: splitMultilineList(story.content.responsibilities),
        technologies: splitCsvList(story.content.technologies),
        sortOrder: parseSortOrder(story.content.sort_order),
      }),
    )
    .sort((left: SortableExperience, right: SortableExperience) => left.sortOrder - right.sortOrder)
    .map(({ sortOrder: _sortOrder, ...experience }: SortableExperience) => experience)
})

export const getProjects = cache(async function getProjects(locale: string): Promise<Project[]> {
  const api = getStoryblokApi()
  const { data } = await api.get('cdn/stories', {
    version,
    language: getLanguage(locale),
    starts_with: 'project/',
    per_page: 100,
  })

  return (
    (data.stories ?? []) as Array<{
      slug: string
      name: string
      content: {
        title?: string
        summary?: string
        tags?: string
        accent?: Array<{ color?: ProjectAccent }>
        cover_image?: { filename?: string }
        live_url?: string
        github_url?: string
        sort_order?: string | number
      }
    }>
  )
    .map(
      (story): Project => ({
        slug: story.slug,
        title: story.content.title || story.name,
        summary: story.content.summary || '',
        tags: splitCsvList(story.content.tags),
        accent: resolveAccent(story.content.accent),
        coverImage: story.content.cover_image?.filename || undefined,
        liveUrl: story.content.live_url || undefined,
        githubUrl: story.content.github_url || undefined,
        sortOrder: parseSortOrder(story.content.sort_order),
      }),
    )
    .sort((left: Project, right: Project) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999))
})
