export interface Profile {
  name: string
  email: string
  github: string
  linkedin: string
  location?: string
  availability?: string
  workType?: string
  workLocation?: string
  visaStatus?: string
  languages?: string
  portfolioTech?: string
  stats: {
    yearsValue: string
    projectsValue: string
    passionValue: string
  }
}
