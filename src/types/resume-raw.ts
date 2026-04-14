export interface RichTextNode {
  type: string
  text?: string
  content?: RichTextNode[]
}

export interface ProfileContentRaw {
  name?: string
  email?: string
  github?: string
  linkedin?: string
  location?: string
  availability?: string
  work_type?: string
  work_location?: string
  visa_status?: string
  languages?: string
  portfolio_tech?: string
}

export interface ExperienceContentRaw {
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

export interface ExperienceStoryRaw {
  slug: string
  name: string
  content: ExperienceContentRaw
}

export interface ProjectContentRaw {
  title?: string
  summary?: string
  tags?: string
  live_url?: string
  github_url?: string
  sort_order?: string | number
}

export interface ProjectStoryRaw {
  slug: string
  name: string
  content: ProjectContentRaw
}

export interface HeroSectionRaw {
  component: 'hero-section'
  badge?: string
  title?: string
  description?: string
}

export interface AboutSectionRaw {
  component: 'about-section'
  bio?: RichTextNode
  features?: Array<{ title?: string; description?: string }>
}

export interface SkillsSectionRaw {
  component: 'skills-section'
  subtitle?: string
  extra?: string
  categories?: Array<{ key?: string; title?: string; skills?: string }>
}

export interface HomeContentRaw {
  body?: Array<{ component?: string; [k: string]: unknown }>
}
