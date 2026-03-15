import type { ReactNode, HTMLAttributes } from 'react'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  className?: string
}
