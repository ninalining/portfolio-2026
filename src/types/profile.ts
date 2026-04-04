export interface Profile {
  name: string
  tagline: string
  email: string
  github: string
  linkedin: string
  location?: string
  stats: {
    yearsValue: string
    projectsValue: string
    passionValue: string
  }
}
