export type ProjectAccent = 'mint' | 'yellow' | 'lavender'

export interface Project {
  slug: string
  title: string
  summary: string
  tags: string[]
  accent: ProjectAccent
  coverImage?: string
  liveUrl?: string
  githubUrl?: string
}
