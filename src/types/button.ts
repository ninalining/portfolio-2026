import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'outline' | 'ghost'

export type ButtonAsAnchor = {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  className?: string
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export type ButtonAsButton = {
  href?: never
  children: ReactNode
  variant?: ButtonVariant
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonProps = ButtonAsAnchor | ButtonAsButton
