import type { ReactNode } from 'react'

export type SectionWrapperProps = {
  id: string
  children: ReactNode
  className?: string
  'aria-label'?: string
}
