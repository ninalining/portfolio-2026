export interface SkillGroup {
  frontend: string[]
  backend: string[]
  tools: string[]
  extra: string[]
}

export type SkillCategoryKey = 'frontend' | 'backend' | 'tools'

export interface SkillCategoryContent {
  _uid: string
  key: SkillCategoryKey
  title: string
  description: string
  skills: string[]
}

export interface SkillsSectionContent {
  subtitle?: string
  categories: SkillCategoryContent[]
  extra: string[]
}
