export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string | null
  location: string
  responsibilities: string[]
  technologies?: string[]
}
